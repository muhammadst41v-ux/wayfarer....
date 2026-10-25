/**
 * Dev-only Image Failure Tracking and Reporting Utility
 * Keeps an audit trail of any image URLs that fail to load, along with context and fallbacks attempted.
 */

export interface ImageFailureRecord {
  url: string;
  alt: string;
  placeName?: string;
  candidateIndex: number;
  totalCandidates: number;
  timestamp: string;
  component?: string;
}

const STORAGE_KEY = 'wayfarer_failed_images_audit_v1';

class ImageFailureTracker {
  private failedMap = new Map<string, ImageFailureRecord>();

  constructor() {
    this.loadFromStorage();
    if (typeof window !== 'undefined') {
      (window as unknown as { __IMAGE_TRACKER__: ImageFailureTracker }).__IMAGE_TRACKER__ = this;
      (window as unknown as { __printFailedImages__: () => void }).__printFailedImages__ = () => {
        this.printReport();
      };
      (window as unknown as { __clearFailedImages__: () => void }).__clearFailedImages__ = () => {
        this.clear();
      };
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ImageFailureRecord[] = JSON.parse(saved);
        parsed.forEach((rec) => this.failedMap.set(rec.url, rec));
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      const records = Array.from(this.failedMap.values());
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Ignore storage errors
    }
  }

  public recordFailure(record: Omit<ImageFailureRecord, 'timestamp'>) {
    const fullRecord: ImageFailureRecord = {
      ...record,
      timestamp: new Date().toISOString(),
    };

    this.failedMap.set(record.url, fullRecord);
    this.saveToStorage();

    // Dev-only console warning
    if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
      console.warn(
        `%c[Wayfarer Image Tracker] %cFailed URL: %c${record.url} %c(Attempt ${record.candidateIndex + 1}/${record.totalCandidates} for "${record.alt || record.placeName || 'Unknown'}")`,
        'color: #f59e0b; font-weight: bold;',
        'color: #ef4444;',
        'color: #38bdf8; text-decoration: underline;',
        'color: #94a3b8;'
      );
    }
  }

  public getFailedList(): ImageFailureRecord[] {
    return Array.from(this.failedMap.values());
  }

  public printReport() {
    const list = this.getFailedList();
    if (list.length === 0) {
      console.log('%c[Wayfarer Image Tracker] All images loaded successfully. Zero failures recorded!', 'color: #10b981; font-weight: bold;');
      return;
    }

    console.group(`%c[Wayfarer Image Audit Report] ${list.length} Failed Image URL(s) Detected`, 'color: #f59e0b; font-weight: bold; font-size: 13px;');
    console.table(
      list.map((r, i) => ({
        '#': i + 1,
        'Place / Alt': r.placeName || r.alt,
        'Failed URL': r.url,
        'Attempt': `${r.candidateIndex + 1} of ${r.totalCandidates}`,
        'Timestamp': r.timestamp,
      }))
    );
    console.log('Call window.__clearFailedImages__() to reset the failure log.');
    console.groupEnd();
  }

  public clear() {
    this.failedMap.clear();
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    console.log('[Wayfarer Image Tracker] Failure log cleared.');
  }
}

export const imageTracker = new ImageFailureTracker();
