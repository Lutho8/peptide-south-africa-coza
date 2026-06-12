export default function TrustedMarquee() {
  const items = [
    "PHYSICIAN-SUPERVISED CARE",
    "COMPOUNDED IN SA",
    "DOCTOR-REVIEWED PROTOCOLS",
    "PERSONALIZED DOSING",
    "SAHPRA COMPLIANT",
  ];

  const marqueeContent = (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-3 mx-6">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-sm font-semibold tracking-widest uppercase text-dark-900 whitespace-nowrap">
            {item}
          </span>
        </span>
      ))}
    </>
  );

  return (
    <section className="bg-white py-5 overflow-hidden border-b border-dark-100">
      <div className="flex animate-marquee">
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0">{marqueeContent}</div>
        <div className="flex shrink-0">{marqueeContent}</div>
      </div>
    </section>
  );
}
