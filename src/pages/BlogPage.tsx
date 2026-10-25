import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTrips } from '../context/TripContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LinkPreviewCard } from '../components/LinkPreviewCard';
import { SmartImage } from '../components/SmartImage';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  BookOpen,
  Search,
  Check,
  Compass,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  List
} from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { currentContent, activeCategory } = useTheme();
  const { showToast } = useTrips();
  const posts = currentContent.blogPosts;

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // If viewing a single post:
  const currentPost = useMemo(() => {
    if (!slug) return null;
    return posts.find((p) => p.slug === slug);
  }, [slug, posts]);

  // Dynamic Title & Meta for Post or Index
  useEffect(() => {
    if (currentPost) {
      document.title = `${currentPost.title} | ${currentContent.brandName} Journal`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', currentPost.excerpt);
      }
    } else {
      document.title = `Field Journal & Essays | ${currentContent.brandName}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `Read architectural dispatches and essays from ${currentContent.brandName} scouts.`);
      }
    }
  }, [currentPost, currentContent]);

  // Extract distinct categories and destinations
  const tags = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [posts]);

  const destinationsList = useMemo(() => {
    const dests = posts
      .map((p) => p.destinationSlug)
      .filter((d): d is string => Boolean(d));
    return ['All', ...Array.from(new Set(dests))];
  }, [posts]);

  // Filtered posts for blog list
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = selectedTag === 'All' || post.category === selectedTag;
      const matchesDest = selectedDestination === 'All' || post.destinationSlug === selectedDestination;
      const matchesType = selectedType === 'All' || post.articleType === selectedType;
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.category.toLowerCase().includes(search.toLowerCase()) ||
        (post.destinationSlug && post.destinationSlug.toLowerCase().includes(search.toLowerCase()));
      return matchesTag && matchesDest && matchesType && matchesSearch;
    });
  }, [posts, selectedTag, selectedDestination, selectedType, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage]);

  const featuredPost = posts[0];

  // -------------------------------------------------------------------------
  // SINGLE POST READER VIEW
  // -------------------------------------------------------------------------
  if (slug) {
    if (!currentPost) {
      return (
        <div className="pt-36 pb-28 px-6 text-center text-white min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 opacity-75" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-3">Article Dispatch Not Found</h1>
          <p className="text-xs text-neutral-400 mb-6">
            The essay <code className="text-amber-300 font-mono">/blog/{slug}</code> is not listed in this pack.
          </p>
          <Link
            to="/blog"
            className="px-5 py-2.5 bg-amber-400 text-neutral-950 font-semibold rounded-full text-xs"
          >
            Back to Journal Index
          </Link>
        </div>
      );
    }

    // Previous and Next Post calculation
    const currentIndex = posts.findIndex((p) => p.slug === currentPost.slug);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    // Related posts from same category
    const relatedPosts = posts
      .filter((p) => p.slug !== currentPost.slug && p.category === currentPost.category)
      .slice(0, 2);

    // Extract table of contents headings (from markdown ## )
    const headings = currentPost.content
      .split('\n')
      .filter((line) => line.startsWith('## '))
      .map((line) => line.replace('## ', '').trim());

    const handleCopyShare = () => {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article dispatch link copied to clipboard');
    };

    return (
      <article className="pt-28 pb-24 px-6 sm:px-8 max-w-4xl mx-auto min-h-screen text-white">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Field Journal', href: '/blog' },
              { label: currentPost.title },
            ]}
          />
        </div>

        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Dispatches</span>
        </Link>

        {/* Post Metadata Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-4">
          <span>{currentPost.category}</span>
          <span className="text-neutral-600">·</span>
          <span>{currentPost.readTime}</span>
          <span className="text-neutral-600">·</span>
          <span>{currentPost.publishedAt}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-white mb-6 leading-tight">
          {currentPost.title}
        </h1>

        {/* Author Lockup & Share */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/10 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <img
              src={currentPost.author.avatar}
              alt={currentPost.author.name}
              className="w-11 h-11 rounded-full object-cover border border-white/10"
            />
            <div>
              <h4 className="text-sm font-medium text-white">{currentPost.author.name}</h4>
              <p className="text-xs text-neutral-400">{currentPost.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Share Article</span>
            </button>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-10">
          <SmartImage
            src={currentPost.coverImage}
            destinationSlug={currentPost.destinationSlug}
            placeName={currentPost.title}
            alt={currentPost.title}
            aspectRatio="16/9"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 mb-10">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-3">
              <List className="w-4 h-4" />
              <span>Index of Sections</span>
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-300 font-sans">
              {headings.map((h, i) => (
                <li key={i} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                  <span className="font-mono text-neutral-500">0{i + 1}.</span>
                  <a href={`#section-${i}`}>{h}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body with Link Preview Cards */}
        <div className="prose prose-invert prose-neutral max-w-none text-neutral-300 font-sans leading-relaxed text-base sm:text-lg space-y-6">
          <p className="font-serif text-xl sm:text-2xl text-amber-200/90 leading-relaxed font-light italic">
            "{currentPost.excerpt}"
          </p>

          {/* Render article sections with parsed markdown headings */}
          {currentPost.content.split('## ').map((section, idx) => {
            if (!section.trim()) return null;
            const [headingTitle, ...paragraphs] = section.split('\n');
            return (
              <div key={idx} id={`section-${idx - 1}`} className="space-y-4 pt-4">
                {idx > 0 && (
                  <h2 className="text-2xl sm:text-3xl font-serif text-white pt-4 border-t border-white/5">
                    {headingTitle}
                  </h2>
                )}
                {paragraphs.join('\n').split('\n\n').map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            );
          })}

          {/* Inline Link-Preview demonstration block */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 my-8 text-xs sm:text-sm text-neutral-300 space-y-2">
            <span className="font-mono text-[10px] uppercase text-amber-400 block tracking-wider">
              Scout Recommendation
            </span>
            <p>
              When exploring these locations, our curators recommend consulting the{' '}
              <LinkPreviewCard
                href="/trips"
                title="Curated City Expeditions"
                description="Small-group journeys led by local architects, historians and culinary masters."
                image={currentPost.coverImage}
                tag="Studio Pass"
              >
                Wayfarer Expeditions Catalog
              </LinkPreviewCard>{' '}
              to inspect active dates and field permits, or testing customized routes with the{' '}
              <LinkPreviewCard
                href="/#ai-planner"
                title="AI Trip Architect"
                description="Generate bespoke 3-day off-grid protocols grounded in 2,400 scout coordinates."
                tag="Intelligent Planner"
              >
                AI Trip Architect
              </LinkPreviewCard>.
            </p>
          </div>
        </div>

        {/* Previous / Next Article Navigation Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-3 group"
            >
              <ChevronLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">Previous Dispatch</span>
                <span className="text-white font-medium line-clamp-1">{prevPost.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-end text-right gap-3 group"
            >
              <div>
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">Next Dispatch</span>
                <span className="text-white font-medium line-clamp-1">{nextPost.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <h3 className="text-xl font-serif text-white mb-6">Related Field Dispatches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="group bg-[#11141c] rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <SmartImage
                      src={rel.coverImage}
                      destinationSlug={rel.destinationSlug}
                      placeName={rel.title}
                      alt={rel.title}
                      aspectRatio="16/10"
                      className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 block mb-1">
                        {rel.publishedAt} · {rel.readTime}
                      </span>
                      <h4 className="text-sm font-serif text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
                        <Link to={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                    </div>
                    <Link
                      to={`/blog/${rel.slug}`}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-white/5"
                    >
                      Read Full Article →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // -------------------------------------------------------------------------
  // BLOG LIST / DIRECTORY VIEW
  // -------------------------------------------------------------------------
  return (
    <div className="pt-28 pb-24 px-6 sm:px-8 max-w-7xl mx-auto min-h-screen text-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Field Journal' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Field Dispatches · {currentContent.brandKicker}
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-light text-white mt-2 mb-3">
          The Wayfarer Journal
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
          Essays on acoustic geography, brutalist memory, culinary fermentation, athletic conditioning, and the philosophy of the unrushed explorer.
        </p>
      </div>

      {/* Featured Marquee Post */}
      {featuredPost && selectedTag === 'All' && !search && (
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#121620] border border-white/12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 group">
            <SmartImage
              src={featuredPost.coverImage}
              destinationSlug={featuredPost.destinationSlug}
              placeName={featuredPost.title}
              alt={featuredPost.title}
              aspectRatio="16/10"
              className="w-full h-full object-cover filter brightness-[0.88] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">Featured</span>
                <span>·</span>
                <span>{featuredPost.category}</span>
                <span>·</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white hover:text-amber-300 transition-colors leading-snug mb-3">
                <Link to={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3 mb-4">
                {featuredPost.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-xs">
                  <span className="text-white block font-medium">{featuredPost.author.name}</span>
                  <span className="text-[10px] text-neutral-400">{featuredPost.publishedAt}</span>
                </div>
              </div>
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded-lg text-xs transition-colors"
              >
                Read Feature
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-[#11141b] border border-white/10 shadow-xl mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search essays by keyword..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <span className="text-xs font-mono text-neutral-400">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'dispatch' : 'dispatches'} published
          </span>
        </div>

        {/* Topic Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-white/5">
          <span className="text-xs font-mono text-neutral-500 shrink-0 mr-1">Topic:</span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedTag === tag
                  ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Destination Filters if available */}
        {destinationsList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-white/5 pt-2">
            <span className="text-xs font-mono text-neutral-500 shrink-0 mr-1">Destination:</span>
            {destinationsList.map((dest) => (
              <button
                key={dest}
                onClick={() => {
                  setSelectedDestination(dest);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono shrink-0 transition-colors capitalize ${
                  selectedDestination === dest
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 border border-white/5'
                }`}
              >
                {dest === 'All' ? 'All Places' : dest.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {paginatedPosts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/10">
          <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-serif text-white mb-1">No dispatches match your query</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
            Try adjusting your topic tags or search keywords to locate related essays.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedTag('All');
            }}
            className="px-4 py-2 bg-amber-400 text-neutral-950 font-semibold rounded-lg text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between bg-[#11141c] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <SmartImage
                  src={post.coverImage}
                  destinationSlug={post.destinationSlug}
                  placeName={post.title}
                  alt={post.title}
                  aspectRatio="16/10"
                  className="w-full h-full object-cover filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[11px] font-mono text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                  {post.category}
                </span>
                {post.destinationSlug && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono capitalize text-slate-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                    📍 {post.destinationSlug.replace(/-/g, ' ')}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 mb-2">
                    <span>{post.publishedAt}</span>
                    <span className="text-neutral-600">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-serif text-white group-hover:text-amber-300 transition-colors mb-3 leading-snug">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs text-neutral-300">{post.author.name}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center gap-2 text-xs font-mono">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`w-9 h-9 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
