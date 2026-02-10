import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
    return (
        <div style={{ background: 'var(--background)' }}>
            {/* Header Banner */}
            <div style={{
                background: 'var(--primary-dark)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Contact Us</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>We'd love to hear from you. Get in touch with the PlantTrade team.</p>
            </div>

            <div className="container section">
                <div className="grid grid-cols-2" style={{ gap: '4rem' }}>

                    {/* Contact Info */}
                    <div>
                        <h2 style={{ marginBottom: '2rem', color: 'var(--primary-dark)' }}>Get in Touch</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{
                                    width: '50px', height: '50px',
                                    background: 'var(--primary-light)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--primary-dark)'
                                }}>
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Phone</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>+91 97546 84978</p>
                                    <p style={{ fontSize: '0.9rem', color: '#888' }}>Mon-Fri, 9am to 6pm</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{
                                    width: '50px', height: '50px',
                                    background: 'var(--primary-light)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--primary-dark)'
                                }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Email</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>support@planttrade.in</p>
                                    <p style={{ fontSize: '0.9rem', color: '#888' }}>For general inquiries</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{
                                    width: '50px', height: '50px',
                                    background: 'var(--primary-light)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--primary-dark)'
                                }}>
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Office</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        PlantTrade HQ, 4th Floor, Green Tower<br />
                                        Outer Ring Road, Bangalore<br />
                                        Karnataka, 560103
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card" style={{ padding: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Send a Message</h2>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div>
                                    <label className="label">First Name</label>
                                    <input type="text" className="input" placeholder="John" />
                                </div>
                                <div>
                                    <label className="label">Last Name</label>
                                    <input type="text" className="input" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="label">Email Address</label>
                                <input type="email" className="input" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="label">Subject</label>
                                <select className="input">
                                    <option>General Inquiry</option>
                                    <option>Nursery Registration</option>
                                    <option>Order Support</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Message</label>
                                <textarea className="input" rows="5" placeholder="How can we help you?"></textarea>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
