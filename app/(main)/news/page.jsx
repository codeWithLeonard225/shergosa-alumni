"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  MdCalendarToday,
  MdCampaign,
  MdPeople,
  MdArrowForward,
  MdAccessTime,
  MdLocationOn,
  MdHiking,
  MdAutorenew,
} from "react-icons/md";


// Firebase Imports
import { db } from "@/app/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// Standardize dataset backup source
import { newsData as fallbackNewsData } from "@/app/data/newsData";


const upcomingEvents = [
  {
    id: "shergosa-waterfall-hiking",
    title: "SHERGOSA Hiking to Mambo Waterfall",
    date: "Saturday, October 31st, 2026",
    time: "8:00 AM",
    location: "Mambo Junction (Meeting Point)",
    type: "Reunion & Health Hike",
    icon: MdHiking,
    description:
      "Step away from everyday routines for a day of fun, fitness, friendship, and reunion. Fee: Le 10. Dress Code: School Colours (Blue & White).",
  },
  {
    id: "project-tenema-tutoring",
    title: "Project Tenema Mentorship & Tutoring",
    date: "Weekly Sessions",
    time: "3:00 PM",
    location: "SOS School Premises",
    type: "Mentorship",
    icon: MdPeople,
    description:
      "Old pupils guide and tutor current SOS students across different academic subjects to uphold academic excellence.",
  },
  {
    id: "shergosa-general-assembly",
    title: "General Alumni Stakeholders Meeting",
    date: "Check Announcements",
    time: "3:30 PM",
    location: "SOS School Compound",
    type: "Official Meeting",
    icon: MdCampaign,
    description:
      "Gathering old pupils across Freetown, Bo, and Makeni branches to align on structural development and alumni welfare initiatives.",
  },
];


export default function NewsEventsPage() {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Realtime listener fetching updates from shergosaNews collection
    const newsRef = collection(db, "shergosaNews");
    const newsQuery = query(newsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        const liveItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (liveItems.length > 0) {
          setNewsList(liveItems);
        } else {
          setNewsList(fallbackNewsData);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching live news from shergosaNews:", error);
        setNewsList(fallbackNewsData);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      {/* HERO HEADER */}
      <section className="bg-gradient-to-r from-indigo-900 to-blue-900 py-20 px-6 text-white text-center shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            News, Meetings & Alumni Activities
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-medium max-w-2xl mx-auto leading-relaxed">
            Stay plugged in with live updates from SHERGOSA (SOS Children's Villages Old Pupils Association), upcoming events, and mentorship initiatives.
          </p>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-indigo-900 inline-block border-b-4 border-orange-500 pb-2">
            Upcoming Events & Milestones
          </h2>
          <p className="text-sm text-slate-500 mt-2">Mark your calendars for upcoming alumni reunions and initiatives.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 border-t-4 border-orange-500"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                    <event.icon className="text-xl" />
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md uppercase tracking-wider">
                    {event.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-indigo-950 mb-2 leading-snug">{event.title}</h3>
                <p className="text-slate-600 mb-6 text-xs leading-relaxed">{event.description}</p>
              </div>

              <div className="space-y-2 border-t border-slate-50 pt-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-orange-500" />
                  <span><strong className="text-slate-700">Date:</strong> {event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-orange-500" />
                  <span><strong className="text-slate-700">Time:</strong> {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                  <span className="line-clamp-1"><strong className="text-slate-700">Location:</strong> {event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT NEWS / PAST ACTIVITIES */}
      <section className="py-16 px-4 sm:px-6 bg-slate-100/60 border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-indigo-900 inline-block border-b-4 border-indigo-500 pb-2">
              Recent News & Portal Updates
            </h2>
            <p className="text-sm text-slate-500 mt-2">Latest verified reporting from old pupil and school executive branches.</p>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
                <FaAutorenew className="text-indigo-900 animate-spin" size={24} />
                <p className="text-xs font-bold text-slate-400 italic">Syncing latest news updates...</p>
              </div>
            ) : newsList.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400 italic">No news updates published yet.</p>
              </div>
            ) : (
              newsList.map((article) => (
                <div 
                  key={article.id} 
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300 border-l-4 border-indigo-600"
                >
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-medium">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-bold uppercase tracking-wider">{article.category || "Shergosa Update"}</span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight hover:text-indigo-600 transition-colors">
                    <Link href={`/news/${article.id}`}>{article.title}</Link>
                  </h3>
                  
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <Link 
                    href={`/news/${article.id}`} 
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-wider group transition duration-200"
                  >
                    Read Full Update 
                    <FaArrowRight className="text-[10px] transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))
            )}
            
            <div className="text-center pt-8">
              <Link
                href="/gallery"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 px-8 rounded-xl transition duration-300 shadow-md hover:shadow-lg transform active:scale-95"
              >
                View Portal Photo Gallery & Archive &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}