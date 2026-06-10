import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/clerk-react";

import Navbar from "../components/header/Header";

import Footer from "../components/footer/Footer";

import ShortenForm from "../components/forms/ShortenForm";

import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />


      <HeroSection />


    <Footer />


    </main>
  );
}