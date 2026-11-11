import React from 'react'
import Hero from '../components/Hero'
import ContactSection from '../components/ContactSection'

const ContactUs = () => {
  return (
    <div>
      <Hero
        variant="centered"
        eyebrow=""
        title=""
        description=""
        primaryAction=""
        secondaryAction=""
        />
        <ContactSection/>
    </div>
  )
}

export default ContactUs
