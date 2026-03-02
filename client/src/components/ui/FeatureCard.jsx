export default function FeatureCard({ title, description, icon }) {
  return (
    <div
      className="
      group
      bg-white/70
      backdrop-blur-sm
      border border-secondary-200
      p-8
      rounded-xl
      shadow-sm
      transition-all
      duration-300
      hover:shadow-xl
      hover:-translate-y-2
      hover:border-primary-600
    "
    >
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        <img src={icon} alt="" className="w-10 h-10" />
      </div>

      <h3 className="text-primary-900 text-lg font-semibold mb-2">{title}</h3>

      <p className="text-secondary-400">{description}</p>
    </div>
  );
}
