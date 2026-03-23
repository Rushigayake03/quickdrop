export default function FeatureCard({ title, description, icon }) {
  return (
    <div
      className="group rounded-xl border border-secondary-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary-600 hover:shadow-xl sm:p-7 lg:p-8"
    >
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
        <img src={icon} alt="" className="h-9 w-9 sm:h-10 sm:w-10" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-primary-900 sm:text-xl">
        {title}
      </h3>

      <p className="text-sm leading-6 text-secondary-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}
