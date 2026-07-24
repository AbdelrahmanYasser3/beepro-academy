import React from "react";

const DashboardCard = ({
  title,
  subtitle,
  action,
  children,
  className = "",
  headerClassName = "",
}) => {
  return (
    <section className={`card overflow-hidden ${className}`.trim()}>
      {(title || subtitle || action) && (
        <div
          className={`flex items-start justify-between gap-3 border-b border-secondary-100 dark:border-dark-border px-5 py-4 ${headerClassName}`.trim()}
        >
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
};

export default DashboardCard;
