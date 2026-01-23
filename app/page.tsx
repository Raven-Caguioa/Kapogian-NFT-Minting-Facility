'use client';

import Link from 'next/link';
import { WalletButton } from '@/components/WalletButton';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ADMIN_ADDRESS } from '@/lib/constants';
import LogoMarquee from '@/components/logo-marquee';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Wand2,
  UserCircle,
  Crown,
  Shirt,
  Wallet,
  GalleryVertical,
  Box,
  CheckCircle,
  Coffee,
  ShoppingBag,
  Lock,
  ShieldCheck,
  FilePlus2,
  Hand,
} from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';

// Enhanced animation variants
const sectionVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const maskedTextVariant = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardContainerVariant = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const cardContentVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// NEW variants for code block animation
const codeContainerVariant = {
  visible: {
    transition: {
      staggerChildren: 0.1, // Time between each line reveal
    },
  },
};

const codeLineVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};


export default function HomePage() {
  const account = useCurrentAccount();
  const isAdmin = account?.address === ADMIN_ADDRESS;

  // Refs for scroll animations
  const pageRef = useRef(null);
  const heroContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: pageRef });
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });

  // Hero Animations
  const heroContentOpacity = useTransform(heroScrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const heroContentY = useTransform(heroScrollYProgress, [0, 0.3], ['0%', '-50%']);
  
  // Multi-layer parallax for the visual card
  const visualContainerY = useTransform(heroScrollYProgress, [0, 1], ['0%', '30%']);
  const visualContainerScale = useTransform(heroScrollYProgress, [0, 1], [1, 0.9]);

  // Mouse-based 3D tilt for hero visual
  const visualCardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualCardRef.current) return;
    const { left, top, width, height } = visualCardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const floatingBadge1Y = useTransform(heroScrollYProgress, [0, 1], [0, -100]);
  const floatingBadge2Y = useTransform(heroScrollYProgress, [0, 1], [0, -150]);
  
  // Background color interpolation
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "hsl(var(--background))",
      "hsl(var(--card))",
      "hsl(var(--background))",
      "hsl(var(--card))",
      "hsl(222 40% 13%)", // Dark section forced color
      "hsl(var(--card))"
    ]
  );
  
  // Code snippet for animated code block
  const codeSnippetJsx = [
      <p key="1"><span className="text-purple-400">const</span> shippingData = &#123;</p>,
      <p key="2" className="pl-4">name: <span className="text-green-400">"Alice User"</span>,</p>,
      <p key="3" className="pl-4">address: <span className="text-green-400">"123 Web3 Lane"</span></p>,
      <p key="4" >&#125;;</p>,
      <p key="5" className="text-gray-600">// Encrypting with Treasury Public Key...</p>,
      <p key="6"><span className="text-purple-400">const</span> encrypted = <span className="text-primary">await</span> encrypt(data, pubKey);</p>,
      <p key="7" className="pl-4 text-gray-500">
        -&gt; "0x7f8a9c2d..." <span className="text-gray-600">// Safe to store on-chain</span>
      </p>
  ];

  // Typing animation state
  const [typingWords] = useState([
    'Own. Receive.', 
    'Collect. Trade.', 
    'Unbox. Enjoy.', 
    'Your Story. Your Chibi.'
  ]);
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Cycling description state
  const [descriptions] = useState([
    "Kapogian is a next-generation character generation facility built on the SUI Network. Every character is unique, provably scarce, and backed by physical merchandise delivered to you.",
    "Our on-chain generator uses AI to create one-of-a-kind characters. Your NFT is not just art; it's a key to a physical product.",
    "Experience true digital ownership. Mint your character, claim your real-world merch, and join the Kapogian universe on the SUI blockchain.",
    "From digital creation to physical delivery, we use cutting-edge cryptography to ensure your data is secure and your ownership is verifiable."
  ]);
  const [descriptionIndex, setDescriptionIndex] = useState(0);

  useEffect(() => {
    const type = () => {
      const currentWord = typingWords[wordIndex];
      const shouldDelete = isDeleting;

      // Determine the new text
      const newText = shouldDelete
        ? currentWord.substring(0, text.length - 1)
        : currentWord.substring(0, text.length + 1);
      
      setText(newText);

      // Determine timing and next state
      if (!shouldDelete && newText === currentWord) {
        // Pause at end of word then start deleting
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (shouldDelete && newText === '') {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % typingWords.length);
      }
    }

    const typingSpeed = isDeleting ? 80 : 150;
    const timer = setTimeout(type, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, typingWords]);

  // Effect for cycling descriptions
  useEffect(() => {
    const interval = setInterval(() => {
      setDescriptionIndex(prevIndex => (prevIndex + 1) % descriptions.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [descriptions.length]);


  return (
    <motion.main ref={pageRef} style={{ backgroundColor }}>
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm font-semibold text-foreground"
            >
              Kapogin
            </Link>
            <span className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full border">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/80 transition-colors font-medium text-xs"
              >
                🔐 Admin
              </Link>
            )}
            <WalletButton />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroContainerRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen pt-32 pb-20 overflow-hidden">
          {/* Background decorative gradient */}
          <motion.div 
            style={{ opacity: useTransform(heroScrollYProgress, [0, 0.5], [1, 0]) }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl gradient-aura pointer-events-none z-0"
          ></motion.div>

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 h-full">
            {/* Left: Content */}
            <motion.div
              style={{ opacity: heroContentOpacity, y: heroContentY }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6 border bg-card/50 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-medium text-muted-foreground">
                  Live on SUI Mainnet
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1] mb-16"
              >
                Generate. Mint.
                <br />
                <span className="text-muted-foreground/80 inline-block align-bottom min-h-[2.5rem] md:min-h-20">
                  {text}
                  <span className="animate-pulse">|</span>
                </span>
              </motion.h1>

              <motion.p
                key={descriptionIndex} // Use key to re-trigger animation on change
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed tracking-tight mb-24 max-w-lg"
              >
                {descriptions[descriptionIndex]}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                {account ? (
                  <Link
                    href="/generate"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg shadow-yellow-400/20"
                  >
                    <Wand2 width={18} strokeWidth={1.5} />
                    <span>Generate Character</span>
                  </Link>
                ) : (
                  <WalletButton />
                )}
              </motion.div>
            </motion.div>

            {/* Right: Visual Prompt Representation */}
            <motion.div
              ref={visualCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                y: visualContainerY,
                scale: visualContainerScale,
              }}
              className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square"
            >
              <div style={{ perspective: '1000px' }} className="w-full h-full">
                <motion.div
                    style={{
                      transformStyle: 'preserve-3d',
                      rotateX,
                      rotateY
                    }}
                    whileHover={{ scale: 1.05, transition: { type: 'spring' } }}
                    className="relative w-full h-full"
                >
                  <div className="absolute inset-0 bg-card rounded-3xl border shadow-2xl group-hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden flex flex-col">
                    {/* Header of card */}
                    <div className="h-10 border-b flex items-center px-4 gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-muted"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-muted"></div>
                      <div className="flex-1"></div>
                      <div className="text-[10px] text-muted-foreground font-medium">
                        kapogian_gen_v1.0
                      </div>
                    </div>
                    {/* Body */}
                    <div className="flex-1 bg-muted/50 relative flex items-center justify-center overflow-hidden">
                      {/* Simulate the 3D character with CSS */}
                      <div className="relative w-64 h-64">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-purple-400 to-accent rounded-full blur-3xl opacity-40 animate-pulse"></div>
                        {/* Placeholder for actual character render */}
                        <div className="relative z-10 w-full h-full bg-gradient-to-b from-card to-muted rounded-2xl shadow-xl flex items-center justify-center border border-card/50">
                          <div className="text-center p-6">
                            <UserCircle className="w-12 h-12 text-muted-foreground/30 mb-4 mx-auto" />
                            <p className="text-sm font-medium text-muted-foreground">
                              Rendering 1-of-1...
                            </p>
                            <div className="mt-4 flex justify-center gap-1">
                              <div className="w-1 h-1 bg-muted-foreground/60 rounded-full"></div>
                              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
                              <div className="w-1 h-1 bg-muted-foreground/20 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Floating Attributes */}
                      <motion.div style={{ y: floatingBadge1Y }} className="absolute top-8 right-8 glass-card px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                        <Crown className="text-accent" />
                        <span className="text-xs font-medium">Legendary Aura</span>
                      </motion.div>
                      <motion.div style={{ y: floatingBadge2Y }} className="absolute bottom-8 left-8 glass-card px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
                        <Shirt className="text-primary" />
                        <span className="text-xs font-medium">Merch Included</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <LogoMarquee />

      {/* About Section */}
      <motion.section 
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-24 bg-card"
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="overflow-hidden mb-6">
            <motion.h2
              variants={maskedTextVariant}
              className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground"
            >
              Not just a JPEG. <br />A physical reality.
            </motion.h2>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Kapogian is a fully automated character generation system that
            produces 1-of-1 digital identities permanently minted on the SUI
            Network.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            But we go further. Every mint includes real-world merchandise,
            securely tied to your NFT through an encrypted on-chain receipt —
            bridging digital ownership and physical utility.
          </p>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariant}
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 border-t bg-background"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="overflow-hidden mb-2">
                <motion.h3 variants={maskedTextVariant} className="text-2xl font-semibold tracking-tight text-foreground">
                  How It Works
                </motion.h3>
              </div>
              <p className="text-sm text-muted-foreground">
                From wallet connection to physical delivery.
              </p>
            </div>
            {/* Step Indicator */}
            <div className="flex gap-1">
              <span className="h-1 w-8 bg-primary rounded-full"></span>
              <span className="h-1 w-2 bg-muted rounded-full"></span>
              <span className="h-1 w-2 bg-muted rounded-full"></span>
              <span className="h-1 w-2 bg-muted rounded-full"></span>
              <span className="h-1 w-2 bg-muted rounded-full"></span>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={cardContainerVariant}
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1 */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 25px -5px hsla(var(--primary) / 0.1), 0 10px 10px -5px hsla(var(--primary) / 0.04)" }}
              className="group bg-card p-8 rounded-2xl border hover:border-muted-foreground/30 transition-all duration-300"
            >
              <motion.div 
                variants={cardContentVariant}
                whileInView={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.5, delay: 0.5 }
                }}
                className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-primary/10 text-primary flex items-center justify-center mb-6"
              >
                <Wallet width="20" />
              </motion.div>
              <div className="overflow-hidden">
                <motion.h4 variants={cardContentVariant} className="text-lg font-semibold text-foreground mb-2">
                  Connect &amp; Generate
                </motion.h4>
              </div>
              <div className="overflow-hidden">
                <motion.p variants={cardContentVariant} className="text-sm text-muted-foreground leading-relaxed">
                  Connect via Sui Wallet or Suiet. Our engine generates a unique
                  1-of-1 character with zero duplicates guaranteed by strict
                  logic.
                </motion.p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 25px -5px hsla(var(--accent) / 0.1), 0 10px 10px -5px hsla(var(--accent) / 0.04)" }}
              className="group bg-card p-8 rounded-2xl border hover:border-muted-foreground/30 transition-all duration-300"
            >
              <motion.div
                variants={cardContentVariant}
                whileInView={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.5, delay: 0.5 }
                }}
                className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-accent/10 text-yellow-600 dark:text-accent flex items-center justify-center mb-6"
              >
                <GalleryVertical width="20" />
              </motion.div>
              <div className="overflow-hidden">
                <motion.h4 variants={cardContentVariant} className="text-lg font-semibold text-foreground mb-2">
                  Mint on SUI
                </motion.h4>
              </div>
              <div className="overflow-hidden">
                <motion.p variants={cardContentVariant} className="text-sm text-muted-foreground leading-relaxed">
                  Mint your character for 20 SUI. Your NFT is stored on IPFS using
                  SUI Display &amp; Kiosk standards for maximum compatibility.
                </motion.p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={cardVariant}
              whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 25px -5px hsla(var(--destructive) / 0.1), 0 10px 10px -5px hsla(var(--destructive) / 0.04)" }}
              className="group bg-card p-8 rounded-2xl border hover:border-muted-foreground/30 transition-all duration-300"
            >
              <motion.div
                variants={cardContentVariant}
                whileInView={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.5, delay: 0.5 }
                }}
                className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-destructive/10 text-destructive flex items-center justify-center mb-6"
              >
                <Box width="20" />
              </motion.div>
              <div className="overflow-hidden">
                <motion.h4 variants={cardContentVariant} className="text-lg font-semibold text-foreground mb-2">
                  Claim Merch
                </motion.h4>
              </div>
              <div className="overflow-hidden">
                <motion.p variants={cardContentVariant} className="text-sm text-muted-foreground leading-relaxed">
                  Enter encrypted shipping details to receive a Soulbound Receipt
                  NFT. Your physical item ships worldwide.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Physical Utility UI Simulation */}
      <motion.section
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-card border-t"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="text-primary font-semibold tracking-wide text-xs uppercase mb-2 block">
              Physical Utility
            </span>
            <div className="overflow-hidden mb-6">
              <motion.h2 variants={maskedTextVariant} className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Select Your Gear
              </motion.h2>
            </div>
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Every mint comes with one physical item of your choice. Upgrade to
              the full bundle to collect them all. Shipping data is encrypted
              client-side.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="text-primary" />
                T-Shirt (Premium Cotton)
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="text-primary" />
                Ceramic Mug
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="text-primary" />
                Gaming Mouse Pad
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="text-primary" />
                Aluminum Collector Plate
              </li>
            </ul>
          </div>

          {/* Interactive UI Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-background border rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-foreground">
                  Select 1 Included Item
                </h4>
                <span className="text-xs text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 px-2 py-1 rounded border border-green-100 dark:border-green-500/20">
                  Included in Mint
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Option 1 */}
                <label className="cursor-pointer group relative">
                  <input
                    type="radio"
                    name="merch"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <div className="p-4 bg-card border rounded-xl peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <Shirt className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                      <div className="w-4 h-4 rounded-full border border-muted-foreground peer-checked:bg-primary peer-checked:border-primary"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground block">
                      T-Shirt
                    </span>
                  </div>
                </label>

                {/* Option 2 */}
                <label className="cursor-pointer group relative">
                  <input type="radio" name="merch" className="peer sr-only" />
                  <div className="p-4 bg-card border rounded-xl peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <Coffee className="w-6 h-6 text-muted-foreground group-hover:text-foreground" />
                      <div className="w-4 h-4 rounded-full border border-muted-foreground peer-checked:bg-primary peer-checked:border-primary"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground block">
                      Mug
                    </span>
                  </div>
                </label>
              </div>

              {/* Upgrade Toggle */}
              <div className="bg-accent/10 border border-accent rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent text-accent-foreground w-8 h-8 rounded-lg flex items-center justify-center">
                    <ShoppingBag width="18" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Get All 4 Items
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upgrade Bundle (+10 SUI)
                    </p>
                  </div>
                </div>

                {/* Custom Toggle */}
                <label
                  htmlFor="upgrade-toggle"
                  className="flex items-center cursor-pointer relative"
                >
                  <input
                    type="checkbox"
                    id="upgrade-toggle"
                    className="sr-only toggle-checkbox"
                  />
                  <div className="toggle-label block bg-input w-10 h-6 rounded-full transition-colors"></div>
                  <div className="dot absolute left-1 top-1 bg-card w-4 h-4 rounded-full transition-transform duration-200 ease-in-out transform translate-x-0 toggle-checkbox:checked:translate-x-full"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Privacy & Security */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={sectionVariant}
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 bg-gray-900 text-gray-200 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block p-3 rounded-xl bg-gray-800 border border-gray-700 mb-6">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div className="overflow-hidden mb-4">
                <motion.h2 variants={maskedTextVariant} className="text-3xl font-semibold tracking-tight text-white">
                  Privacy by Design
                </motion.h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Kapogian uses asymmetric cryptography to ensure your shipping
                details never exist in plain text.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 text-green-400" />
                  <span className="text-sm text-gray-300">
                    Client-side encryption before data leaves your browser.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FilePlus2 className="mt-1 text-green-400" />
                  <span className="text-sm text-gray-300">
                    Soulbound Receipt NFT acts as non-transferable proof.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Hand className="mt-1 text-green-400" />
                  <span className="text-sm text-gray-300">
                    Only the Admin Wallet can decrypt for fulfillment.
                  </span>
                </li>
              </ul>
            </div>

            {/* Code Block / Technical Visual */}
             <motion.div
                variants={codeContainerVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                className="bg-black/50 border border-gray-800 rounded-2xl p-6 font-mono text-xs overflow-hidden"
              >
                <div className="flex gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="space-y-2 text-gray-400">
                  {codeSnippetJsx.map((line, index) => (
                      <motion.div key={index} variants={codeLineVariant}>
                          {line}
                      </motion.div>
                  ))}
                </div>
              </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        variants={sectionVariant}
        viewport={{ once: true, amount: 0.5 }}
        className="py-32 bg-card border-t text-center relative overflow-hidden scroll-mt-20"
        style={{ scrollSnapAlign: 'center' }}
      >
        <motion.div 
          whileInView={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 gradient-aura pointer-events-none"
        ></motion.div>

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <div className="overflow-hidden mb-6">
            <motion.h2 variants={maskedTextVariant} className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
              Your Kapogian Is Waiting
            </motion.h2>
          </div>
          <p className="text-muted-foreground mb-10 text-lg">
            Mint a one-of-one character. Receive real merchandise.
            <br />
            Own a piece of the universe.
          </p>
          
          <motion.div
            whileInView={{ scale: 1.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Link
              href="/generate"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-yellow-400/20 inline-block"
            >
              Generate &amp; Mint Now
            </Link>
          </motion.div>
          <p className="mt-4 text-xs text-muted-foreground">
            Requires SUI Wallet • Gas fees apply
          </p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-sm font-semibold tracking-tighter uppercase text-foreground">
            KAPOGIAN
          </span>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Discord
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Tradeport
            </a>
          </div>

          <span className="text-xs text-muted-foreground">
            © 2026 Kapogian on SUI.
          </span>
        </div>
      </footer>
    </motion.main>
  );
}
