"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Firebase Imports for DB Syncing
import { db } from "@/app/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// Central backup dataset file
import { newsData as fallbackNewsData } from "@/app/data/newsData";

import {
  FaGraduationCap,
  FaHandsHelping,
  FaUsers,
  FaSchool,
  FaAward,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserAlt,
  FaClock,
  FaNewspaper,
  FaHiking,
} from "react-icons/fa";

import { motion } from "framer-motion";

const ORGANIZATION_NAME = "Shergosa Alumni";

const aimsAndObjectivesHome = [
  {
    icon: FaUsers,
    title: "Alumni Network",
    description: "Reconnecting old pupils of SOS Children's Villages to build a powerful network of professional and personal support.",
  },
  {
    icon: FaSchool,
    title: "School Development",
    description: "Actively participating in school activities and contributing to the structural and educational growth of our alma mater.",
  },
  {
    icon: FaHandsHelping,
    title: "Mentorship",
    description: "Encouraging old pupils to guide current students through career talks, coaching, and life skills sharing. That is why Project Tenema has been launched to tutor the pupils in different aspects of their academics.",
  },
  {
    icon: FaAward,
    title: "Legacy & Excellence",
    description: "Promoting a culture of excellence and ensuring the SOS legacy continues through impactful alumni-led initiatives.",
  },
];

// Single upcoming activity detail
const upcomingEvent = {
  title: "Hiking to Mambo Waterfall",
  date: "Saturday, 31st October 2026",
  time: "8:00 AM",
  location: "Mambo Junction (Meeting Point)",
  fee: "Le 10",
  dressCode: "School Colours (Blue & White)",
  host: "SHERGOSA Executive",
  icon: FaHiking,
  description: "A day of fun, fitness, friendship, reunion, and creating unforgettable memories together!",
};

export default function HomePage() {
  const [newsFeed, setNewsFeed] = useState(fallbackNewsData);

  useEffect(() => {
    // Updated to query shergosaNews collection
    const newsRef = collection(db, "shergosaNews");
    const newsQuery = query(newsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        const liveItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (liveItems.length > 0) {
          setNewsFeed([...liveItems, ...fallbackNewsData]);
        } else {
          setNewsFeed(fallbackNewsData);
        }
      },
      (error) => {
        console.error("Error loading updates from Firestore:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="overflow-hidden bg-white w-full">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center py-20 sm:py-24 px-4 sm:px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/images/alumni-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-indigo-950/80" />

        <div className="hidden sm:block absolute top-10 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="hidden sm:block absolute bottom-10 right-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 w-full max-w-4xl mx-auto"
        >
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-[24px] sm:rounded-[40px] shadow-2xl p-6 sm:p-10 md:p-16 text-center">

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-orange-400 shadow-2xl bg-white flex items-center justify-center">
                <Image
                  src="/images/alumni-hero.jpg"
                  alt="School Logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
              Welcome to <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent block mt-2">
                {ORGANIZATION_NAME}
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              A united platform for SOS Hermann Gmeiner Old Students' Association Sierra Leone (Freetown, Bo, and Makeni) to support current students and strengthen our SOS family.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
              <Link
                href="/about"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition duration-300 text-center shadow-xl hover:scale-105"
              >
                Learn More
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition duration-300 text-center shadow-xl hover:scale-105"
              >
                Join the Alumni
              </Link>
            </div>

          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[50px] sm:h-[90px] md:h-[120px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L80,122.7C160,149,320,203,480,208C640,213,800,171,960,144C1120,117,1280,107,1360,101.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
          </svg>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { number: "3+", label: "Branches (Freetown, Bo, Makeni)" },
            { number: "100+", label: "Active Registered Alumni" },
            { number: "10+", label: "Mentorship & Project Tenema Sessions" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-50 to-orange-50 rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-md text-center border border-indigo-100"
            >
              <h2 className="text-4xl sm:text-5xl font-black text-indigo-700">{item.number}</h2>
              <p className="mt-2 text-gray-600 text-base sm:text-lg">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <FaGraduationCap className="text-5xl sm:text-7xl text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black text-indigo-900 mb-6 sm:mb-8">Our Mission</h2>
          <blockquote className="text-lg sm:text-xl md:text-2xl italic text-gray-700 leading-relaxed">
            "To unite old students of SOS Hermann Gmeiner School across Freetown, Bo, and Makeni; foster mentorship, networking, and mutual support among members; uphold the core values and motto of the school, 'Seize the Opportunity'; and actively support educational advancement, leadership development, and community service initiatives that positively impact current students and the nation."
          </blockquote>
        </div>
      </section>

      {/* WHY WE ARE HERE SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-indigo-900 mb-12">
            Why We Are Here
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {aimsAndObjectivesHome.map((aim, index) => (
              <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md border-b-4 border-orange-500 transition duration-300 hover:shadow-xl flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                  <aim.icon className="text-2xl sm:text-3xl text-indigo-700" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-3">{aim.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{aim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING ACTIVITIES SECTION (BRIEF SINGLE EVENT) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-indigo-50">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl sm:text-4xl font-black text-center text-indigo-900 mb-3">
            Upcoming Activity
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
            Reconnect, stay fit, and create memories with fellow old pupils!
          </p>

          {/* Single Event Brief Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border-t-4 border-orange-500 hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                <upcomingEvent.icon />
              </div>
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-1 rounded-md">
                  Featured Event
                </span>
                <h3 className="text-2xl font-black text-indigo-900 mt-1">
                  {upcomingEvent.title}
                </h3>
              </div>
            </div>

            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
              {upcomingEvent.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 mb-6">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />
                <strong>Date:</strong> {upcomingEvent.date}
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-orange-500" />
                <strong>Time:</strong> {upcomingEvent.time}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                <strong>Meeting Point:</strong> {upcomingEvent.location}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500 font-bold">💰</span>
                <strong>Fee & Dress Code:</strong> {upcomingEvent.fee} | {upcomingEvent.dressCode}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaUserAlt className="text-slate-400" />
                <span><strong>Host:</strong> {upcomingEvent.host}</span>
              </div>
              <a 
                href="mailto:Shergosa2k26@gmail.com" 
                className="text-indigo-600 hover:underline font-bold"
              >
                Shergosa2k26@gmail.com
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* LATEST NEWS & UPDATES SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-indigo-900 flex items-center gap-3">
                <FaNewspaper className="text-orange-500 text-2xl sm:text-3xl" />
                Latest News & Updates
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-md">
                Follow recent happenings, celebrations, and foundational developments across our SOS alumni community.
              </p>
            </div>
            <Link 
              href="/news" 
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-2 group transition text-sm sm:text-base whitespace-nowrap self-start sm:self-auto"
            >
              View All News 
              <FaArrowRight className="text-xs transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newsFeed.map((item, index) => (
              <motion.article 
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                {/* News Media Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <span className="absolute top-4 left-4 z-10 bg-indigo-600/90 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-md">
                    {item.category || "Alumni Update"}
                  </span>

                  {item.type === "video" && item.video ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video 
                        src={item.video} 
                        className="w-full h-full object-cover opacity-90"
                        controls
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <Image 
                      src={item.image || "/images/alumni-hero.jpg"} 
                      alt={item.title || "News media image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={typeof item.image === "string" && item.image.startsWith("http")}
                    />
                  )}
                </div>

                {/* News Content Body */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 block">
                    {item.date}
                  </span>
                  <h3 className="text-lg font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {item.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <Link 
                      href={`/news/${item.id}`}
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm uppercase tracking-wider group/link"
                    >
                      Read Full Story
                      <FaArrowRight className="text-[10px] transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden text-white text-center bg-indigo-900">
        <div className="relative max-w-3xl mx-auto z-10">
          <FaGraduationCap className="text-6xl sm:text-7xl mx-auto mb-6 text-orange-400" />
          <h2 className="text-3xl sm:text-5xl font-black mb-4 sm:mb-6 leading-tight">
            Once an SOS Pupil, <br /> Always an SOS Supporter
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-indigo-100 leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
            Whether you want to mentor through Project Tenema, organize an event, or donate to school projects, your involvement matters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
            <Link
              href="/activities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-base sm:text-lg transition duration-300 shadow-xl"
            >
              View Activities <FaArrowRight />
            </Link>
            <Link
              href="/donate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-indigo-900 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold text-base sm:text-lg transition duration-300 shadow-xl"
            >
              Support School Projects
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}