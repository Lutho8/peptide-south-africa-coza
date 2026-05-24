// Floating WhatsApp call-to-action.
// Pinned bottom-right on every route, opens WhatsApp chat.
// NOTE: replace [YOUR_NUMBER] with your real WhatsApp number in international format.
const WA_NUMBER = '[YOUR_NUMBER]';
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20RTD`;

export function WhatsAppFab() {
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
      style={{
        width: 56,
        height: 56,
        backgroundColor: '#25D366',
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        right: 'max(1rem, env(safe-area-inset-right, 1rem))',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
      }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" aria-hidden="true">
        <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.385.696 4.61 1.897 6.487L4 29l7.74-1.86A11.94 11.94 0 0 0 16.003 27C22.633 27 28 21.628 28 15S22.633 3 16.003 3zm0 21.6c-1.875 0-3.62-.55-5.087-1.497l-.365-.227-4.594 1.104 1.13-4.473-.238-.379A9.553 9.553 0 0 1 6.4 15c0-5.293 4.31-9.6 9.603-9.6 5.291 0 9.597 4.307 9.597 9.6s-4.306 9.6-9.597 9.6zm5.523-7.184c-.303-.152-1.79-.882-2.067-.982-.277-.101-.479-.152-.681.152-.202.303-.78.982-.957 1.184-.176.202-.353.227-.656.076-.303-.151-1.28-.471-2.438-1.502-.901-.803-1.51-1.795-1.687-2.098-.176-.303-.019-.467.133-.618.137-.136.303-.353.454-.53.151-.176.202-.303.303-.505.101-.202.05-.379-.025-.53-.076-.152-.681-1.644-.934-2.252-.246-.591-.497-.51-.681-.519l-.581-.011a1.117 1.117 0 0 0-.807.379c-.277.303-1.058 1.034-1.058 2.52 0 1.487 1.083 2.924 1.234 3.126.151.202 2.131 3.254 5.165 4.563.722.312 1.286.498 1.725.638.725.231 1.385.198 1.907.12.582-.087 1.79-.731 2.043-1.438.252-.706.252-1.31.176-1.438-.076-.127-.277-.202-.58-.353z" />
      </svg>
    </a>
  );
}

export default WhatsAppFab;
