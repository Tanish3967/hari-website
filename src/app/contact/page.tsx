import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="bg-slate-900 text-white py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Get in touch with our clinic. We are here to help you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 flex-1 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* Contact Details & Map */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Clinic Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Address</h3>
                                        <p className="text-slate-600 mt-1">123 Health Avenue, Medical District<br />Cityville, ST 12345</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Phone</h3>
                                        <p className="text-slate-600 mt-1">1-800-123-4567<br />Emergency: 911</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Email</h3>
                                        <p className="text-slate-600 mt-1">appointments@drsmithclinic.com<br />info@drsmithclinic.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-64 relative">
                            {/* Embed Google Maps IFrame */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.213215589139!2d-73.98774848466601!3d40.751410179327575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25902e8d35661%3A0x6fb0d26857ba0b8b!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1683832147385!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Clinic Location"
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                    </div>

                    {/* Quick Contact Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 relative overflow-hidden border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
                        <p className="text-slate-500 mb-8">For general inquiries only. Do not send medical records.</p>

                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">First Name</label>
                                    <Input placeholder="John" className="bg-slate-50 focus-visible:bg-white transition-colors border-slate-200 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                                    <Input placeholder="Doe" className="bg-slate-50 focus-visible:bg-white transition-colors border-slate-200 h-12" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <Input type="email" placeholder="john@example.com" className="bg-slate-50 focus-visible:bg-white transition-colors border-slate-200 h-12" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                <Input type="tel" placeholder="(555) 123-4567" className="bg-slate-50 focus-visible:bg-white transition-colors border-slate-200 h-12" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Message</label>
                                <Textarea placeholder="How can we help you?" className="min-h-[150px] bg-slate-50 focus-visible:bg-white transition-colors border-slate-200 resize-none" />
                            </div>

                            <Button type="button" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-md rounded-xl shadow-md transition-all active:scale-[0.98]">
                                Send Message
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}
