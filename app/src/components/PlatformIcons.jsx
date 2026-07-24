export default function PlatformIcons({ platforms = [] }) {
  if (!platforms.length) return null;

  return (
    <div className="flex items-center gap-1.5 text-white/50">
      {platforms.includes('windows') && <WindowsIcon />}
      {(platforms.includes('apple') || platforms.includes('mac')) && <AppleIcon />}
      {platforms.includes('linux') && <LinuxIcon />}
    </div>
  );
}

function WindowsIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.801" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.7-1.13 1.83-.99 2.93 1.07.08 2.14-.53 2.8-1.33z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12.002 0c-2.47 0-4.475 2.003-4.475 4.475 0 1.057.368 2.03.984 2.793-.721 1.042-1.156 2.302-1.156 3.67 0 2.298 1.226 4.3 3.054 5.434C9.53 17.65 7.02 19.86 7.02 22.5h9.964c0-2.64-2.51-4.85-3.39-6.128 1.828-1.134 3.054-3.136 3.054-5.434 0-1.368-.435-2.628-1.156-3.67.616-.763.984-1.736.984-2.793C16.476 2.003 14.472 0 12.002 0z" />
    </svg>
  );
}
