import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, DonationItem, RescueMissionTask, VerificationAuditItem, NotificationItem } from './types';
import { INITIAL_DONATIONS, INITIAL_ACTIVE_TASK, INITIAL_VERIFICATIONS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { NearbyExplore } from './components/NearbyExplore';
import { DonatePost } from './components/DonatePost';
import { ActivityTasks } from './components/ActivityTasks';
import { ImpactMetrics } from './components/ImpactMetrics';
import { AdminPortal } from './components/AdminPortal';
import { ClaimModal } from './components/ClaimModal';
import { DocReviewModal } from './components/DocReviewModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { Toast, ToastProps } from './components/Toast';
import { createClaim, createDonation, getDonations, toDonationItem } from './api/client';

export default function App() {
  // Navigation & Role states
  const [currentRole, setCurrentRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  const [donations, setDonations] = useState<DonationItem[]>([]);

  const [activeTask, setActiveTask] = useState<RescueMissionTask>(() => {
    try {
      const saved = localStorage.getItem('nourishlink_active_task');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_TASK;
    } catch {
      return INITIAL_ACTIVE_TASK;
    }
  });

  const [verifications, setVerifications] = useState<VerificationAuditItem[]>(() => {
    try {
      const saved = localStorage.getItem('nourishlink_verifications');
      return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
    } catch {
      return INITIAL_VERIFICATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('nourishlink_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Modal states
  const [claimModalDonation, setClaimModalDonation] = useState<DonationItem | null>(null);
  const [docReviewItem, setDocReviewItem] = useState<VerificationAuditItem | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [callModal, setCallModal] = useState<{ name: string; phone: string } | null>(null);

  // Global Toast state
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'>>({
    show: false,
    title: '',
    message: '',
  });

  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const checkBackend = async () => {
    setBackendStatus('checking');
    try {
      const response = await fetch('/api/public/health', { cache: 'no-store' });
      if (!response.ok) throw new Error('Health check failed');
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackend();
    let isCurrent = true;
    getDonations()
      .then((records) => {
        if (isCurrent) setDonations(records.map(toDonationItem));
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          showToast('Backend unavailable', error instanceof Error ? error.message : 'Could not load donations.');
        }
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nourishlink_active_task', JSON.stringify(activeTask));
    } catch {}
  }, [activeTask]);

  useEffect(() => {
    try {
      localStorage.setItem('nourishlink_verifications', JSON.stringify(verifications));
    } catch {}
  }, [verifications]);

  useEffect(() => {
    try {
      localStorage.setItem('nourishlink_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const showToast = (title: string, message: string, actionText?: string, onAction?: () => void) => {
    setToast({
      show: true,
      title,
      message,
      actionText,
      onAction,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Actions
  const handleClaimDonation = async (donation: DonationItem, transportNotes: string) => {
    const ngoOrganizationId = Number(import.meta.env.VITE_NGO_ORG_ID);
    if (!Number.isInteger(ngoOrganizationId) || ngoOrganizationId <= 0) {
      showToast('NGO setup required', 'Set VITE_NGO_ORG_ID to an existing NGO organization ID.');
      return;
    }

    try {
      await createClaim(Number(donation.id), ngoOrganizationId);
      const records = await getDonations();
      setDonations(records.map(toDonationItem));
    } catch (error) {
      showToast('Claim failed', error instanceof Error ? error.message : 'Could not claim this donation.');
      throw error;
    }

    // Create or update task
    const newTask: RescueMissionTask = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      donationId: donation.id,
      donorName: donation.donorOrg.name,
      donorAddress: donation.donorOrg.address,
      donorPhone: donation.donorOrg.phone,
      donorNotes: donation.pickupNote || 'Loading dock access. Ring bell upon arrival.',
      recipientOrg: 'Hope Shelter Home',
      recipientAddress: 'Sector 4, Community Lane • 4.8 km stretch',
      recipientContact: 'Sister Clara',
      recipientPhone: '+91 98765 43210',
      recipientPhotoUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAxfaPgiCOUFcwUnEimTmAr63pNq4bOsxp3tiTZnOWOxwPl-K-e2mDX7kZwS0oLMBaqNhfa7jtVQBDI0LwNkzpHm0J0lp14BcMje5E5EEgXRLv4vSHVQu-HtU7YxI62SpY583KlJdEQ_lQq-Z89huRIVNBV6DSt3oR_-pWMbkAGCrVvKgp5yUmOP86L34uPlec-rGXzP1eOApjJ1XfiMzWsHY-NG4CjdYZeCkfkm5JTYFKjD_lpuUMU',
      gateAccessCode: '#4920',
      dropoffInstructions: 'Drive around to Kitchen Ramp C for direct unloading cart access.',
      distanceTotalKm: parseFloat((donation.distanceKm + 3.2).toFixed(1)),
      etaMinutes: Math.round(donation.distanceKm * 4 + 5),
      manifestDescription: `${donation.quantityKg} kg ${donation.category} (${donation.title})`,
      weightKg: donation.quantityKg,
      storageSpecs: `${donation.storageType} • Safe window remaining`,
      safeWindowText: donation.expiresInText,
      status: 'EN_ROUTE_PICKUP',
      pickupCompleted: false,
    };
    setActiveTask(newTask);

    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Donation Claimed!',
      message: `You claimed ${donation.title} from ${donation.donorOrg.name}. Route assigned.`,
      timestamp: 'Just now',
      read: false,
      type: 'claim',
      linkTab: 'activity',
    };
    setNotifications([newNotif, ...notifications]);

    showToast(
      'Lot Successfully Reserved!',
      'Pickup slot secured. Route dispatched to driver.',
      'Track',
      () => setActiveTab('activity')
    );
  };

  const handlePublishDonation = async (newDonation: DonationItem) => {
    const donorOrganizationId = Number(import.meta.env.VITE_DONOR_ORG_ID);
    if (!Number.isInteger(donorOrganizationId) || donorOrganizationId <= 0) {
      showToast('Donor setup required', 'Set VITE_DONOR_ORG_ID to an existing donor organization ID.');
      return;
    }

    try {
      await createDonation(donorOrganizationId, {
        foodType: newDonation.description,
        quantityKg: newDonation.quantityKg,
        preparedAt: new Date(newDonation.preparedAt).toISOString(),
        bestBeforeAt: new Date(newDonation.bestBeforeAt).toISOString(),
        pickupAddress: newDonation.pickupAddress,
        pickupLatitude: newDonation.pickupLatitude,
        pickupLongitude: newDonation.pickupLongitude,
        servings: newDonation.servings,
        category: newDonation.category,
        allergens: newDonation.dietaryTags.join(', '),
        images: JSON.stringify(newDonation.images),
      });
      const records = await getDonations();
      setDonations(records.map(toDonationItem));
    } catch (error) {
      showToast('Donation could not be published', error instanceof Error ? error.message : 'Check the backend connection.');
      return;
    }
    setActiveTab('nearby');

    // Add alert notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Surplus Broadcast Active',
      message: `${newDonation.title} published. Broadcasted to 38 verified NGOs nearby.`,
      timestamp: 'Just now',
      read: false,
      type: 'urgent',
      linkTab: 'nearby',
    };
    setNotifications([newNotif, ...notifications]);

    showToast(
      'Surplus Donation Broadcasted!',
      'Nearby verified NGOs alerted. First responder will claim shortly.',
      'View Feed',
      () => setActiveTab('nearby')
    );
  };

  const handleApproveVerification = (item: VerificationAuditItem) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, status: 'APPROVED' as const } : v))
    );

    showToast(
      'Organization Verified!',
      `${item.name} granted clearance. Safe food audit verified.`,
      'Queue',
      () => setActiveTab('impact')
    );
  };

  const handleCompleteDelivery = (task: RescueMissionTask) => {
    setActiveTask(task);
    showToast(
      'Safe Handover Completed! 🎉',
      `PoD verified with Sister Clara. ${task.weightKg} kg of surplus food reached families in need.`,
      'Impact',
      () => setActiveTab('impact')
    );
  };

  const handleResetData = () => {
    localStorage.removeItem('nourishlink_active_task');
    localStorage.removeItem('nourishlink_verifications');
    localStorage.removeItem('nourishlink_notifications');
    setDonations([]);
    setActiveTask(INITIAL_ACTIVE_TASK);
    setVerifications(INITIAL_VERIFICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    showToast('Sandbox Reset', 'Initial sample lots and test missions restored.');
  };

  const handleSimulateNewDonation = () => {
    const simulated: DonationItem = {
      id: `DON-${Date.now().toString().slice(-4)}`,
      donorOrg: {
        id: 'ORG-SIM',
        name: 'The Leela Palace Banquet Hall',
        address: 'Old Airport Road, Bengaluru',
        phone: '+91 99887 76655',
        verifiedKitchen: true,
      },
      title: '85 Servings (approx. 32 kg)',
      description: 'Gourmet Vegetable Pulao, Paneer Tikka Masala and Mixed Dal from corporate conference lunch.',
      category: 'Cooked Meal',
      quantityKg: 32,
      servings: 85,
      co2SavedKg: 83.2,
      preparedAt: 'Today, 2:15 PM',
      bestBeforeAt: 'Today, 5:30 PM',
      expiresInText: 'Expires in 1h 15m',
      isUrgent: true,
      distanceKm: 2.1,
      pickupAddress: 'Old Airport Road, Bengaluru East',
      pickupLatitude: 12.9601,
      pickupLongitude: 77.6486,
      storageType: 'Cooked Hot (Ready for pickup)',
      logisticsNote: 'Insulated Bags Recommended',
      dietaryTags: ['100% Vegetarian', 'Contains Dairy', 'Nut-Free'],
      status: 'AVAILABLE',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCeQUBac-Ksll3oNpipVXeG00YKVpAWlRhEOz3OQGBgb0u_wPvvSMwiZkgd68M7Z_VZw8hSmdAEv3FtvOzmz7WSWNnLnqCrqjuIfRVCnPGiOtWO7aJ7nnihAtdl30iGBZZFL-iY6-ZdPQrsFjRbwougDQuEkbnVWf1NrEvh1Rj1mnDN1ZeX_M8jskddGH1bhsekcCC2Y01s5j94bByfF-XjJO0kbpGscksp1YDlSgxLI2OY2a-M2e-q',
      ],
      createdAt: new Date().toISOString(),
    };

    setDonations([simulated, ...donations]);
    showToast(
      'New Urgent Surplus Available!',
      '85 Servings (32 kg) listed by The Leela Palace. Expires in 1h 15m.',
      'Claim Now',
      () => {
        setActiveTab('nearby');
        setClaimModalDonation(simulated);
      }
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-full flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#85f8c4] selection:text-[#002114]">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 w-full pt-16 ${isMobileFrame ? 'py-8 flex justify-center bg-[#1e2433]' : 'pb-16'}`}>
        {isMobileFrame ? (
          /* Phone Device Mockup Container for Preview Mode */
          <div className="w-[390px] h-[844px] bg-[#faf8ff] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-[10px] border-[#131b2e] flex flex-col overflow-hidden relative">
            {/* Phone Speaker & Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#131b2e] rounded-full z-50 flex items-center justify-end px-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e2a44]" />
            </div>

            {/* Simulated Mobile Status Bar */}
            <div className="pt-3 px-6 pb-1 flex justify-between items-center text-[11px] font-bold text-[#131b2e] z-40 bg-[#faf8ff]/80 backdrop-blur-sm">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[13px]">signal_cellular_4_bar</span>
                <span className="material-symbols-outlined text-[13px]">wifi</span>
                <span className="material-symbols-outlined text-[14px]">battery_full</span>
              </div>
            </div>

            {/* Scrollable Mobile Body */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`mobile-${activeTab}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {activeTab === 'landing' && (
                    <LandingPage
                      donations={donations}
                      onLaunchApp={(tab) => setActiveTab(tab || 'nearby')}
                      onSelectRole={(role) => setCurrentRole(role)}
                    />
                  )}

                  {activeTab === 'nearby' && (
                    <NearbyExplore
                      donations={donations}
                      onOpenClaimModal={(item) => setClaimModalDonation(item)}
                      onPostNewDonation={() => setActiveTab('donate')}
                      onCallContact={(name, phone) => setCallModal({ name, phone })}
                    />
                  )}

                  {activeTab === 'donate' && (
                    <DonatePost
                      onPublishSuccess={handlePublishDonation}
                      onCancel={() => setActiveTab('nearby')}
                    />
                  )}

                  {activeTab === 'activity' && (
                    <ActivityTasks
                      task={activeTask}
                      onUpdateTask={setActiveTask}
                      onCallContact={(name, phone) => setCallModal({ name, phone })}
                      onCompleteDelivery={handleCompleteDelivery}
                    />
                  )}

                  {activeTab === 'impact' && (
                    <ImpactMetrics
                      verifications={verifications}
                      onApproveItem={handleApproveVerification}
                      onOpenDocReview={(item) => setDocReviewItem(item)}
                    />
                  )}

                  {activeTab === 'admin' && (
                    <AdminPortal
                      donations={donations}
                      task={activeTask}
                      verifications={verifications}
                      onResetData={handleResetData}
                      onSimulateNewDonation={handleSimulateNewDonation}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Mobile Bottom Navigation Inside Phone Shell */}
            <BottomNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeTaskCount={activeTask.status !== 'COMPLETED' ? 1 : 0}
            />

            {/* Phone Home Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#131b2e]/40 rounded-full pointer-events-none z-50" />
          </div>
        ) : (
          /* Full Responsive Web Layout */
          <main className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`desktop-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full"
              >
                {activeTab === 'landing' && (
                  <LandingPage
                    donations={donations}
                    onLaunchApp={(tab) => setActiveTab(tab || 'nearby')}
                    onSelectRole={(role) => setCurrentRole(role)}
                  />
                )}

                {activeTab === 'nearby' && (
                  <NearbyExplore
                    donations={donations}
                    onOpenClaimModal={(item) => setClaimModalDonation(item)}
                    onPostNewDonation={() => setActiveTab('donate')}
                    onCallContact={(name, phone) => setCallModal({ name, phone })}
                  />
                )}

                {activeTab === 'donate' && (
                  <DonatePost
                    onPublishSuccess={handlePublishDonation}
                    onCancel={() => setActiveTab('nearby')}
                  />
                )}

                {activeTab === 'activity' && (
                  <ActivityTasks
                    task={activeTask}
                    onUpdateTask={setActiveTask}
                    onCallContact={(name, phone) => setCallModal({ name, phone })}
                    onCompleteDelivery={handleCompleteDelivery}
                  />
                )}

                {activeTab === 'impact' && (
                  <ImpactMetrics
                    verifications={verifications}
                    onApproveItem={handleApproveVerification}
                    onOpenDocReview={(item) => setDocReviewItem(item)}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminPortal
                    donations={donations}
                    task={activeTask}
                    verifications={verifications}
                    onResetData={handleResetData}
                    onSimulateNewDonation={handleSimulateNewDonation}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        )}
      </div>

      {/* Fixed Bottom Navigation on actual mobile viewports (when not in desktop phone frame) */}
      {!isMobileFrame && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeTaskCount={activeTask.status !== 'COMPLETED' ? 1 : 0}
        />
      )}

      {/* Interactive Claim Modal */}
      <ClaimModal
        donation={claimModalDonation}
        onClose={() => setClaimModalDonation(null)}
        onConfirmClaim={handleClaimDonation}
      />

      {/* Compliance Document Review Modal */}
      <DocReviewModal
        item={docReviewItem}
        onClose={() => setDocReviewItem(null)}
        onApprove={handleApproveVerification}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(notif) => {
          if (notif.linkTab) setActiveTab(notif.linkTab);
          setNotifications(
            notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
          );
          setNotificationsOpen(false);
        }}
      />

      {/* User Profile & Role Switcher Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentRole={currentRole}
        onRoleChange={(r) => {
          setCurrentRole(r);
          setProfileOpen(false);
          showToast('Perspective Switched', `Now viewing as ${r.toUpperCase()}.`);
        }}
      />

      {/* Quick Phone Call Dialog */}
      {callModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-[#dae2fd] text-center flex flex-col gap-3">
            <div className="w-12 h-12 rounded-full bg-[#e2e7ff] text-[#006948] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">call</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#131b2e]">{callModal.name}</h3>
              <p className="text-xs text-[#3d4a42] font-mono mt-0.5">{callModal.phone}</p>
            </div>
            <p className="text-[11px] text-[#6d7a72]">
              Direct coordinator line for swift food rescue handoff.
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href={`tel:${callModal.phone}`}
                onClick={() => setCallModal(null)}
                className="flex-1 py-2.5 bg-[#006948] hover:bg-[#00855d] text-white text-xs font-bold rounded-lg text-center shadow-xs"
              >
                Place Call
              </a>
              <button
                type="button"
                onClick={() => setCallModal(null)}
                className="py-2.5 px-3 bg-[#eaedff] text-[#131b2e] text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating System Toast */}
      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        actionText={toast.actionText}
        onAction={toast.onAction}
        onClose={handleCloseToast}
      />
    </div>
  );
}
