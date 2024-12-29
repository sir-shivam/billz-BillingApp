
"use client"
import React from 'react';
import OpenWhatsApp from '../components/openWhat';

const what = () => {
  return (
    <div>
      <OpenWhatsApp 
        phoneNumber="918799836952" 
        message="Hello! Here is the link to your bill: https://billz-billing-app.vercel.app/invoicing" 
      />
    </div>
  );
};

export default what;
