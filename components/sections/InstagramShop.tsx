import { ArrowUpRight, Instagram, Play } from "lucide-react";
import { instagramUrl } from "@/lib/content/minus-one";

const posts = [
  { className: "post-espresso", label: "new batch", type: "photo" },
  { className: "post-copper", label: "pour day", type: "reel" },
  { className: "post-olive", label: "matcha mood", type: "photo" },
  { className: "post-walnut", label: "menu notes", type: "reel" }
];

export function InstagramShop() {
  return (
    <section id="instagram" className="section instagram-section">
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow"><Instagram size={15} aria-hidden="true" /> The real shop lives here</p>
          <h2>See the pour. Send the DM.</h2>
        </div>
        <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
          @minus.onecoffee <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
      <div className="post-grid">
        {posts.map((post) => (
          <a className={`mock-post ${post.className}`} href={instagramUrl} target="_blank" rel="noreferrer" key={post.label}>
            <span className="post-grain" />
            {post.type === "reel" && <span className="post-play"><Play size={16} fill="currentColor" aria-hidden="true" /></span>}
            <span className="post-label">{post.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
