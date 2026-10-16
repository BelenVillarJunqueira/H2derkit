import React, { useState, useEffect } from 'react';
import { 
  StoreContent, 
  MediaItem, 
  ReviewItem, 
  OrderItem 
} from './types/store';
import { 
  getStoreContent, 
  getStoreMedia, 
  getStoreReviews, 
  getMediaFromIndexedDB,
  getContentFromIndexedDB,
  fetchServerContent,
  fetchServerMedia,
  fetchServerGateways,
  getStoredCart,
  saveStoredCart,
  CartState,
  recordVisit, 
  recordAddToCart, 
  recordInitiateCheckout 
} from './services/storage';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { ProductHero } from './components/ProductHero';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ProblemSolutionSection } from './components/ProblemSolutionSection';
import { RoutineStepsSection } from './components/RoutineStepsSection';
import { ActiveIngredientsSection } from './components/ActiveIngredientsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { GuaranteeBanner } from './components/GuaranteeBanner';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { LiveSalesNotifications } from './components/LiveSalesNotifications';
import { TrackingModal } from './components/TrackingModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [content, setContent] = useState<StoreContent>(getStoreContent());
  const [media, setMedia] = useState<MediaItem[]>(getStoreMedia());
  const [reviews, setReviews] = useState<ReviewItem[]>(getStoreReviews());

  // Persistent cart state loaded from localStorage
  const [initialCart] = useState<CartState>(() => getStoredCart());
  const [selectedPackId, setSelectedPackId] = useState<string>(initialCart.selectedPackId);

  // Modals & Drawers
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [trackingInitialCode, setTrackingInitialCode] = useState('');

  // Cart item count and empty state (persisted across reloads)
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(initialCart.isCartEmpty);
  const [cartCount, setCartCount] = useState<number>(initialCart.isCartEmpty ? 0 : initialCart.cartCount);

  // Initialize and listen for changes from the Admin Panel
  useEffect(() => {
    // Record visit on initial mount
    recordVisit();

    // Check if URL has #admin or #seguimiento or Mercado Pago callback
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    } else if (window.location.hash.startsWith('#tracking')) {
      setIsTrackingOpen(true);
    }

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('payment_status') === 'approved' || searchParams.get('status') === 'approved') {
      const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
      if (orderId) setTrackingInitialCode(orderId);
      setIsTrackingOpen(true);
    }

    // 1. Load persistent media and content from local IndexedDB first for instant rendering
    let serverMediaReceived = false;
    let serverContentReceived = false;

    getMediaFromIndexedDB().then((indexedMedia) => {
      if (!serverMediaReceived && indexedMedia && Array.isArray(indexedMedia) && indexedMedia.length > 0) {
        setMedia(indexedMedia);
      }
    });

    getContentFromIndexedDB().then((indexedContent) => {
      if (!serverContentReceived && indexedContent) {
        const localContent = getStoreContent();
        const indexedTime = (indexedContent as any).updatedAt || 0;
        const localTime = (localContent as any).updatedAt || 0;
        if (indexedTime >= localTime) {
          setContent(indexedContent);
        }
      }
    });

    // 2. Fetch authoritative stored content & media from server & MongoDB Atlas (with cache busting)
    fetchServerContent().then((serverContent) => {
      if (serverContent) {
        serverContentReceived = true;
        setContent(serverContent);
      }
    });

    fetchServerMedia().then((serverMedia) => {
      if (serverMedia) {
        serverMediaReceived = true;
        setMedia(serverMedia);
      }
    });

    fetchServerGateways();

    const handleContentUpdate = (e: CustomEvent<StoreContent>) => {
      setContent(e.detail);
    };

    const handleMediaUpdate = (e: CustomEvent<MediaItem[]>) => {
      setMedia(e.detail);
    };

    const handleReviewsUpdate = (e: CustomEvent<ReviewItem[]>) => {
      setReviews(e.detail);
    };

    const handleCartUpdate = (e: CustomEvent<CartState>) => {
      const c = e.detail;
      setIsCartEmpty(c.isCartEmpty);
      setCartCount(c.isCartEmpty ? 0 : c.cartCount);
      if (c.selectedPackId) setSelectedPackId(c.selectedPackId);
    };

    window.addEventListener('h2derm_content_updated', handleContentUpdate as EventListener);
    window.addEventListener('h2derm_media_updated', handleMediaUpdate as EventListener);
    window.addEventListener('h2derm_reviews_updated', handleReviewsUpdate as EventListener);
    window.addEventListener('h2derm_cart_updated', handleCartUpdate as EventListener);

    return () => {
      window.removeEventListener('h2derm_content_updated', handleContentUpdate as EventListener);
      window.removeEventListener('h2derm_media_updated', handleMediaUpdate as EventListener);
      window.removeEventListener('h2derm_reviews_updated', handleReviewsUpdate as EventListener);
      window.removeEventListener('h2derm_cart_updated', handleCartUpdate as EventListener);
    };
  }, []);

  const selectedPack = content.packs.find(p => p.id === selectedPackId) || content.packs[0];

  const handleSelectPack = (packId: string) => {
    setSelectedPackId(packId);
    setIsCartEmpty(false);
    setCartCount(1);
    saveStoredCart({ isCartEmpty: false, cartCount: 1, selectedPackId: packId });
    recordAddToCart();
  };

  const handleRemoveFromCart = () => {
    setIsCartEmpty(true);
    setCartCount(0);
    saveStoredCart({ isCartEmpty: true, cartCount: 0, selectedPackId });
  };

  const handleOpenBuyCheckout = () => {
    // If cart was emptied and user clicks buy on the main landing page, auto restore selected pack
    if (isCartEmpty) {
      setIsCartEmpty(false);
      setCartCount(1);
      saveStoredCart({ isCartEmpty: false, cartCount: 1, selectedPackId });
    }
    recordInitiateCheckout();
    setIsCheckoutOpen(true);
  };

  const handleOpenCartDrawer = () => {
    // Open modal respecting current empty/filled state
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: OrderItem) => {
    setIsCartEmpty(true);
    setCartCount(0);
    saveStoredCart({ isCartEmpty: true, cartCount: 0, selectedPackId });
    setTrackingInitialCode(order.trackingCode);
  };

  const handleOpenTrackingWithCode = (code?: string) => {
    if (code) setTrackingInitialCode(code);
    setIsTrackingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans selection:bg-purple-700 selection:text-white">
      
      {/* 1. Top Urgency & Free Shipping Bar */}
      <AnnouncementBar
        content={content}
        onOpenTracking={() => handleOpenTrackingWithCode()}
        onOpenPushPrompt={() => {
          if ('Notification' in window) {
            Notification.requestPermission();
          }
        }}
      />

      {/* 2. Main Navigation Header */}
      <Navbar
        content={content}
        cartCount={cartCount}
        onOpenCart={handleOpenCartDrawer}
        onOpenTracking={() => handleOpenTrackingWithCode()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 3. Hero Section & Product Bundle Engine */}
      <main className="flex-1">
        <ProductHero
          content={content}
          media={media}
          selectedPackId={selectedPackId}
          onSelectPack={handleSelectPack}
          onBuyNow={handleOpenBuyCheckout}
        />

        {/* 4. Interactive Before & After Slider */}
        <BeforeAfterSection
          content={content}
          onCtaClick={handleOpenBuyCheckout}
        />

        {/* 5. Problem vs Solution & Comparison Table */}
        <ProblemSolutionSection
          content={content}
          onCtaClick={handleOpenBuyCheckout}
        />

        {/* 6. The 4 Steps of the Daily Routine */}
        <RoutineStepsSection
          content={content}
          onCtaClick={handleOpenBuyCheckout}
        />

        {/* 7. Clinical Actives Formulation */}
        <ActiveIngredientsSection content={content} />

        {/* 8. Verified Reviews with Photos */}
        <ReviewsSection
          reviews={reviews}
          onReviewsUpdated={setReviews}
        />

        {/* 9. 30-Day Unconditional Guarantee */}
        <GuaranteeBanner
          content={content}
          onCtaClick={handleOpenBuyCheckout}
        />

        {/* 10. Frequently Asked Questions (FAQ) */}
        <FaqSection />
      </main>

      {/* 11. Store Footer */}
      <Footer
        content={content}
        onOpenTracking={() => handleOpenTrackingWithCode()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 12. Sticky Mobile Bottom Conversion Bar */}
      <StickyMobileBar
        selectedPack={selectedPack}
        currencySymbol={content.currencySymbol}
        onBuyNow={handleOpenBuyCheckout}
      />

      {/* 13. Social Proof Real-time Popups */}
      <LiveSalesNotifications />

      {/* 14. Functional One-Page Checkout Modal (Mercado Pago, Contraentrega, CBU) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPack={selectedPack}
        content={content}
        onOrderCompleted={handleOrderCompleted}
        onSelectPack={handleSelectPack}
        onRemoveFromCart={handleRemoveFromCart}
        isCartEmpty={isCartEmpty}
      />

      {/* 15. Live Order Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialTrackingCode={trackingInitialCode}
      />

      {/* 16. Hidden Admin Dashboard Console */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}
