const testimonials = [
  { category: "coffee regular", position: "50% 15%" },
  { category: "matcha regular", position: "40% 45%" },
  { category: "chocolate regular", position: "60% 70%" },
  { category: "repeat order", position: "50% 92%" }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="section testimonial-section">
      <div className="section-heading testimonial-heading">
        <p className="eyebrow">Loved by our regulars</p>
        <h2>What people are saying.</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => (
          <figure className="testimonial-card" key={testimonial.category}>
            <div className="testimonial-image">
              <img
                src="/assets/moc-person-original.png"
                alt="Minus One Coffee customer artwork"
                style={{ objectPosition: testimonial.position }}
              />
            </div>
            <figcaption>
              <span>0{index + 1}</span>
              <strong>{testimonial.category}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
