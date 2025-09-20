const cn = (...classes) => classes.filter(Boolean).join(" ");

const variantClasses = {
  plain: "",
  glass: "glass-panel px-6 sm:px-8 py-8 sm:py-10",
  subtle: "section-gradient px-6 sm:px-8 py-8 sm:py-10",
};

const PageShell = ({
  children,
  className = "",
  dir,
  padded = true,
  fullWidth = false,
  variant = "plain",
}) => {
  const containerClasses = cn(
    "relative mx-auto w-full",
    fullWidth ? "max-w-[1600px]" : "max-w-6xl",
    padded ? "px-4 sm:px-6 lg:px-8" : ""
  );

  const inner = variantClasses[variant] ?? variantClasses.glass;

  return (
    <div dir={dir} className="w-full">
      <div className={containerClasses}>
        <div className={cn(inner, className)}>{children}</div>
      </div>
    </div>
  );
};

export const PageSection = ({ children, className = "", as = "section", ...rest }) => {
  const Tag = as;
  return (
    <Tag className={cn("section-gradient p-6 sm:p-8", className)} {...rest}>
      {children}
    </Tag>
  );
};

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "start",
  actions,
  className = "",
}) => (
  <header
    className={cn(
      "flex flex-col gap-3",
      align === "center" ? "items-center text-center" : "text-left",
      className
    )}
  >
    {eyebrow ? (
      <span className="text-[0.65rem] uppercase tracking-[0.3em] text-sky-300/80 font-semibold">
        {eyebrow}
      </span>
    ) : null}
    {title ? (
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
        {title}
      </h1>
    ) : null}
    {description ? (
      <p className="max-w-2xl text-sm sm:text-base text-slate-300/90">{description}</p>
    ) : null}
    {actions ? (
      <div className="mt-2 flex flex-wrap items-center gap-3 sm:justify-start">
        {actions}
      </div>
    ) : null}
  </header>
);

export default PageShell;
