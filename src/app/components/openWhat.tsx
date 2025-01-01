import React from 'react';

interface OpenWhatsAppProps {
  phoneNumber: string; // Phone number in international format (e.g., '918123456789')
  message: string; // Message to be pre-filled in WhatsApp
}

const OpenWhatsApp: React.FC<OpenWhatsAppProps> = ({ phoneNumber, message , }) => {
  const handleOpenWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
        
      <button
        onClick={handleOpenWhatsApp}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: 'white',
          backgroundColor: '#25D366',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Open WhatsApp
      </button>
    </div>
  );
};

export default OpenWhatsApp;
