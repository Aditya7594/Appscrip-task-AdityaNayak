import React from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  className?: string;
}

export interface ChevronIconProps extends IconProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SearchIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7465 21 11.5C21 6.25311 16.7467 2 11.5 2C6.25329 2 2 6.25311 2 11.5C2 16.7465 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface HeartIconProps extends IconProps {
  filled?: boolean;
}

export function HeartIcon({ size = 24, filled = false, className, ...props }: HeartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#EB4C6B' : 'none'}
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M12.62 20.8116C12.28 20.9316 11.72 20.9316 11.38 20.8116C8.48 19.8216 2 15.6916 2 8.69156C2 5.60156 4.49 3.10156 7.56 3.10156C9.38 3.10156 10.99 3.98156 12 5.34156C13.01 3.98156 14.63 3.10156 16.44 3.10156C19.51 3.10156 22 5.60156 22 8.69156C22 15.6916 15.52 19.8216 12.62 20.8116Z"
        stroke={filled ? '#EB4C6B' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? '#EB4C6B' : 'none'}
      />
    </svg>
  );
}

export function BagIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M8.396 6.5H15.596C18.996 6.5 19.336 8.09 19.566 10.03L20.466 17.53C20.756 19.99 19.996 22 16.496 22H7.506C3.996 22 3.236 19.99 3.536 17.53L4.436 10.03C4.656 8.09 4.996 6.5 8.396 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.41 17.0312H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M12.162 10.87C12.062 10.86 11.942 10.86 11.832 10.87C9.452 10.79 7.562 8.84 7.562 6.44C7.562 3.99 9.543 2 12.003 2C14.453 2 16.443 3.99 16.443 6.44C16.433 8.84 14.543 10.79 12.162 10.87Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.159 14.56C4.739 16.18 4.739 18.82 7.159 20.43C9.909 22.27 14.419 22.27 17.169 20.43C19.589 18.81 19.589 16.17 17.169 14.56C14.429 12.73 9.919 12.73 7.159 14.56Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronIcon({
  size = 16,
  direction = 'down',
  className,
  style,
  ...props
}: ChevronIconProps) {
  const rotation =
    direction === 'up'
      ? 'rotate(180deg)'
      : direction === 'left'
        ? 'rotate(90deg)'
        : direction === 'right'
          ? 'rotate(-90deg)'
          : 'rotate(0deg)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        transform: rotation,
        transformOrigin: 'center',
        transition: 'transform 0.2s ease',
        ...style,
      }}
      {...props}
    >
      <path
        d="M3.5 6L8 10.5L12.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M4 12.5L9.5 18L20 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Element4Icon({ size = 16, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M14.6667 7.26146V2.72812C14.6667 1.72812 14.24 1.32812 13.18 1.32812H10.4867C9.42667 1.32812 9 1.72812 9 2.72812V7.26146C9 8.26146 9.42667 8.66146 10.4867 8.66146H13.18C14.24 8.66146 14.6667 8.26146 14.6667 7.26146Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 13.2719V12.0719C14.6667 11.0719 14.24 10.6719 13.18 10.6719H10.4867C9.42667 10.6719 9 11.0719 9 12.0719V13.2719C9 14.2719 9.42667 14.6719 10.4867 14.6719H13.18C14.24 14.6719 14.6667 14.2719 14.6667 13.2719Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.0026 8.72813V13.2615C7.0026 14.2615 6.57594 14.6615 5.51594 14.6615H2.8226C1.7626 14.6615 1.33594 14.2615 1.33594 13.2615V8.72813C1.33594 7.72813 1.7626 7.32812 2.8226 7.32812H5.51594C6.57594 7.32812 7.0026 7.72813 7.0026 8.72813Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.0026 2.72812V3.92813C7.0026 4.92813 6.57594 5.32813 5.51594 5.32813H2.8226C1.7626 5.32813 1.33594 4.92813 1.33594 3.92813V2.72812C1.33594 1.72812 1.7626 1.32812 2.8226 1.32812H5.51594C6.57594 1.32812 7.0026 1.72812 7.0026 2.72812Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

export function HamburgerIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 17H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMarkIcon({ size = 36, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M1.5577 29.0769C0.259618 31.976 0.0865438 34.5289 0.0865438 35.524C0.0865438 35.7837 0.30289 35.9567 0.519237 35.9567C1.77405 35.8702 5.49521 35.4808 8.78367 33.4471C9.3029 33.101 9.82213 32.7981 10.2548 32.4519C16.0096 28.2981 17.1779 21.9375 17.351 20.3365C17.5241 20.2067 17.6106 20.1202 17.7404 19.9904H18.1298C18.3029 20.1202 18.3894 20.2067 18.5625 20.3798C18.6923 21.8077 19.5144 26.9567 24.2741 31.2837C24.4039 31.4135 24.577 31.4135 24.75 31.3702C24.9664 31.2837 25.1827 31.1539 25.4423 30.9808C25.702 30.851 25.702 30.5048 25.4856 30.3317C20.8125 26.2212 20.1635 20.4663 20.1202 20.2067C28.2981 21.375 31.5866 27.3462 31.5866 27.2596C32.1923 28.125 32.2789 28.4279 32.452 28.774C32.452 28.774 33.7068 30.851 34.1827 33.7933C34.226 34.0529 34.0097 34.3125 33.7068 34.2692C32.3654 34.0529 31.1539 33.6635 30.2452 33.3173C30.1154 33.274 29.9423 33.274 29.8558 33.3606C29.6395 33.5337 29.4231 33.7067 29.2068 33.8365C28.9472 34.0096 28.9904 34.4423 29.2933 34.5288C30.7645 35.1779 32.9712 35.8269 35.5241 35.9135C35.7837 35.9135 35.9568 35.6971 35.9568 35.4808C35.7404 30.7212 33.4472 27.2163 33.4472 27.2163C33.1875 26.7404 32.8414 26.2644 32.452 25.7452C32.452 25.7452 28.4279 19.6442 20.3798 18.6058C20.1635 18.5625 20.0337 18.3894 20.0337 18.2164C20.0337 18 20.0337 17.8269 20.0337 17.6971C20.0337 17.5673 20.25 17.4808 20.3366 17.4375C26.2212 16.6154 29.8991 13.3269 31.5 11.5096C31.6299 11.3798 31.6298 11.1635 31.5433 11.0337C31.4135 10.8173 31.2837 10.5577 31.1539 10.3413C31.0241 10.0817 30.6779 10.0817 30.4616 10.2981C28.9471 12.1586 25.6587 15.101 20.1202 15.8798C20.1635 15.5769 20.9856 8.5673 27.1298 4.45673C27.6923 4.11057 28.2116 3.76442 28.6875 3.5048C28.6875 3.5048 30.851 2.25 33.7068 1.81731C33.9664 1.77404 34.226 2.03365 34.1827 2.29326C33.9664 3.72115 33.5337 4.93269 33.1875 5.84135C33.1443 5.97115 33.1443 6.14423 33.2308 6.23077C33.4039 6.44711 33.577 6.70673 33.7068 6.92308C33.8798 7.18269 34.3125 7.13942 34.4424 6.83653C35.6972 3.98076 35.8702 1.47115 35.8702 0.475958C35.8702 0.216342 35.6539 0.0432653 35.4375 0.0432653C34.1827 0.129804 30.4616 0.519228 27.1731 2.55288C26.6106 2.89904 26.0481 3.24519 25.702 3.54808C19.9471 7.70192 18.7789 14.0625 18.6058 15.6635C18.4327 15.7933 18.3462 15.8798 18.2164 16.0096H17.8269C17.6539 15.8798 17.5673 15.7933 17.3943 15.6202C17.2644 14.1923 16.4423 9.08654 11.6827 4.71634C11.5529 4.58654 11.3798 4.58653 11.2067 4.67307C10.9904 4.80288 10.7308 4.93269 10.5144 5.0625C10.2548 5.19231 10.2548 5.53846 10.4712 5.71154C15.1443 9.82212 15.7933 15.5769 15.8366 15.8365C7.65867 14.7115 4.50001 8.82692 4.41347 8.74038C4.11059 8.26442 3.8077 7.78846 3.50481 7.22596C3.50481 7.22596 2.29327 5.1923 1.77404 2.20673C1.99039 1.99038 2.03366 1.94712 2.25001 1.73077C3.59136 1.94712 4.8029 2.33654 5.71155 2.68269C5.84136 2.72596 6.01443 2.72596 6.10097 2.59615C6.31732 2.42308 6.53366 2.25 6.75001 2.12019C7.00963 1.94711 6.96635 1.51442 6.66347 1.38461C5.19231 0.735576 2.98558 0.0865385 0.432693 0C0.173077 0 0 0.216346 0 0.432692C0.216346 5.19231 2.50963 8.69711 2.50963 8.69711C2.76924 9.17307 3.11539 9.60577 3.50481 10.1683C3.50481 10.1683 7.52886 16.2692 15.5769 17.3077C15.7933 17.351 15.9231 17.524 15.9231 17.6971C15.9231 17.8702 15.9231 18.0433 15.9231 18.1731C15.9231 18.3462 15.75 18.476 15.6635 18.476C9.77886 19.2548 6.10097 22.5865 4.5 24.4038C4.41346 24.5337 4.3702 24.6635 4.41347 24.8365C4.50001 25.0962 4.67309 25.3558 4.80289 25.6154C4.9327 25.875 5.27886 25.875 5.45193 25.6587C6.96636 23.8413 10.2548 20.8125 15.8366 20.0337C15.7933 20.3365 14.9712 27.3461 8.82693 31.4567C8.61058 31.6298 8.35098 31.7596 8.13463 31.9327C7.87502 32.1058 5.14905 33.6202 2.25001 34.0962C1.99039 34.1394 1.73077 33.8798 1.77404 33.6202C1.99039 32.149 2.42308 30.8942 2.8125 30.0288C2.85577 29.899 2.85577 29.726 2.76923 29.6394C2.59615 29.4231 2.42309 29.1635 2.29328 28.9471C2.07693 28.7308 1.6875 28.774 1.5577 29.0769ZM3.50481 28.6875C4.32693 29.7692 5.3654 30.7644 6.18752 31.5C6.31732 31.6298 6.53366 31.6298 6.66347 31.5433C6.87981 31.4135 7.13943 31.2837 7.35578 31.1538C7.57212 31.024 7.6154 30.6779 7.39905 30.5048C5.66828 29.0337 4.45674 27.2163 4.45674 27.2163C4.15386 26.7837 3.85097 26.2644 3.54809 25.7019C2.03366 22.7596 1.64424 20.0769 1.60097 18.2596C1.60097 17.4808 1.64423 16.7452 1.73077 16.0961C1.77404 15.9663 1.77404 15.8798 1.77404 15.8798C1.99039 14.2356 2.37981 12.8942 2.76923 11.9423C2.8125 11.8125 2.81251 11.6394 2.72597 11.5529C2.5529 11.3798 2.42309 11.1202 2.25001 10.9038C2.07693 10.6442 1.64423 10.6875 1.51442 10.9904C1.03846 12.2019 0.475962 13.8461 0.216346 15.8798C0.216346 15.8798 -0.822116 21.4183 2.59616 27.1731C2.85577 27.7788 3.20193 28.2981 3.50481 28.6875ZM32.4087 7.26923C31.5866 6.1875 30.5481 5.1923 29.726 4.45673C29.5962 4.32692 29.4231 4.32692 29.25 4.41346C29.0337 4.54327 28.7741 4.67307 28.5577 4.80288C28.3414 4.93269 28.2981 5.27884 28.5145 5.45192C30.2452 6.92307 31.4568 8.74038 31.4568 8.74038C31.7597 9.12981 32.0625 9.64904 32.3654 10.2548C33.8799 13.1971 34.2693 15.8798 34.3125 17.6971C34.3125 18.476 34.2693 19.2115 34.1827 19.8606C34.1395 19.9904 34.1395 20.0769 34.1395 20.0769C33.9231 21.7644 33.5337 23.1058 33.1443 24.0577C33.101 24.1875 33.101 24.3606 33.2308 24.4904C33.4039 24.7067 33.577 24.9231 33.7068 25.1394C33.8798 25.399 34.3125 25.3558 34.4424 25.0529C34.9183 23.8413 35.4808 22.1538 35.7404 20.1202C35.7404 20.1202 36.7789 14.5817 33.3606 8.82692C33.101 8.26442 32.7548 7.74519 32.4087 7.26923ZM10.1683 3.59134C10.3414 3.5048 10.601 3.33173 10.774 3.24519C16.6587 0.475962 21.7644 1.81731 24.1875 2.8125C24.3173 2.85577 24.4904 2.85577 24.577 2.76923C24.7933 2.59615 25.0096 2.42308 25.2693 2.25C25.5289 2.07692 25.4856 1.64423 25.1827 1.51442C21.7212 0 18.1298 0 17.9135 0C17.6539 0 12.8077 -5.36442e-06 8.69713 2.50961C8.22117 2.81249 7.78847 3.11538 7.31251 3.46154C7.31251 3.46154 5.9279 4.5 4.62982 5.84135C4.50001 5.97115 4.50001 6.14423 4.58655 6.3173C4.71635 6.57692 4.84616 6.83653 4.97597 7.05288C5.10578 7.3125 5.45193 7.3125 5.62501 7.13942C6.40385 6.27404 7.48559 5.23558 8.7404 4.41346C9.21636 4.11058 9.69232 3.85096 10.1683 3.59134ZM28.5577 32.4952C28.5577 32.4952 29.8991 31.4567 31.2404 30.1154C31.3702 29.9856 31.3702 29.8125 31.327 29.6394C31.1972 29.3798 31.0673 29.1635 30.9375 28.9038C30.8077 28.6442 30.4616 28.6442 30.2885 28.8606C29.5529 29.6827 28.7308 30.5481 27.5193 31.3702C27.1298 31.6731 26.3943 32.149 25.7452 32.4952C19.601 35.6539 14.2789 34.226 11.7693 33.2308C11.6394 33.1875 11.4664 33.1875 11.3798 33.274C11.1635 33.4471 10.9039 33.6202 10.6875 33.75C10.4279 33.9231 10.4712 34.3558 10.774 34.4856C14.2356 36 17.8269 36 18.0433 36C18.3029 36 23.1491 36 27.2596 33.4904C27.6491 33.1442 28.125 32.8414 28.5577 32.4952ZM17.9568 17.5673C18.1298 17.7404 18.2164 17.8269 18.3894 18C18.2164 18.1731 18.1298 18.2596 17.9568 18.3894C17.7404 18.3894 17.5241 18.2163 17.5241 17.9567C17.6971 17.8269 17.7837 17.7404 17.9568 17.5673Z" />
    </svg>
  );
}

export function CloseIcon({ size = 20, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
