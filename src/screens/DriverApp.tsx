import { useState } from "react";
import parkings from "../data/parkings.json";
import type { TabId } from "../components/BottomNav";
import { useUser } from "../context/UserContext";
import { DriverLayout } from "../layout/DriverLayout";
import type { BookingSelection } from "../types/booking";
import type { Parking } from "../types/parking";
import type { Reservation } from "../types/reservation";
import { BookingSummaryScreen } from "./BookingSummaryScreen";
import { FinalQrScreen } from "./FinalQrScreen";
import { HomeScreen } from "./HomeScreen";
import { ParkingDetailScreen } from "./ParkingDetailScreen";
import { ProfileScreen } from "./ProfileScreen";
import { ReservationsScreen } from "./ReservationsScreen";
import { SearchScreen } from "./SearchScreen";

const parkingList = parkings as Parking[];
type BookingStep = "tabs" | "detail" | "summary" | "qr";
const RESERVATION_STORAGE_KEY = "parkonba.reservations";

function readStoredReservations(): Reservation[] {
  const storedReservations = window.localStorage.getItem(
    RESERVATION_STORAGE_KEY,
  );

  if (!storedReservations) {
    return [];
  }

  try {
    return JSON.parse(storedReservations) as Reservation[];
  } catch {
    return [];
  }
}

function persistReservations(reservations: Reservation[]) {
  window.localStorage.setItem(
    RESERVATION_STORAGE_KEY,
    JSON.stringify(reservations),
  );
}

function getFallbackBooking() {
  const startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() < 30 ? 30 : 60, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 2);

  return {
    dateLabel: `Hoy, ${startDate.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
    })}`,
    startTime: startDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    endTime: endDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

export function DriverApp() {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabId>("inicio");
  const [bookingStep, setBookingStep] = useState<BookingStep>("tabs");
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    readStoredReservations(),
  );
  const [bookingSelection, setBookingSelection] =
    useState<BookingSelection | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [selectedParkingId, setSelectedParkingId] = useState(
    parkingList[2]?.id ?? parkingList[0].id,
  );
  const selectedParking =
    parkingList.find((parking) => parking.id === selectedParkingId) ??
    parkingList[0];
  const userReservations = reservations.filter(
    (reservation) => reservation.userId === currentUser?.id,
  );
  const activeReservations = userReservations.filter(
    (reservation) => reservation.status === "active",
  );
  const reservationHistory = userReservations.filter(
    (reservation) => reservation.status !== "active",
  );
  const activeReservation =
    activeReservations.find(
      (reservation) =>
        reservation.userId === currentUser?.id && reservation.status === "active",
    ) ?? null;
  const reservationParking =
    parkingList.find((parking) => parking.id === activeReservation?.parkingId) ??
    selectedParking;
  const qrParking =
    parkingList.find(
      (parking) =>
        parking.id === (selectedReservation?.parkingId ?? activeReservation?.parkingId),
    ) ?? selectedParking;

  function openDetail() {
    setBookingStep("detail");
  }

  function closeFlow() {
    setBookingStep("tabs");
  }

  function backToDetail() {
    setBookingStep("detail");
  }

  function backToReservations() {
    setBookingStep("tabs");
    setActiveTab("reservas");
  }

  function openSummary(selection: BookingSelection) {
    setBookingSelection(selection);
    setBookingStep("summary");
  }

  function confirmPayment(paymentMethod: string) {
    if (!currentUser) {
      return;
    }

    if (activeReservations.length >= 3) {
      setBookingStep("tabs");
      setActiveTab("reservas");
      return;
    }

    const fallbackBooking = getFallbackBooking();
    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      parkingId: selectedParking.id,
      userId: currentUser.id,
      parkingName: selectedParking.nombre,
      parkingAddress: selectedParking.direccion,
      parkingImage: selectedParking.imagen,
      dateLabel: bookingSelection?.dateLabel ?? fallbackBooking.dateLabel,
      startTime: bookingSelection?.startTime ?? fallbackBooking.startTime,
      endTime: bookingSelection?.endTime ?? fallbackBooking.endTime,
      durationHours: bookingSelection?.durationHours ?? 2,
      total: bookingSelection?.total ?? 2400,
      paymentMethod,
      code: "PQ5X9K",
      status: "active",
    };
    const nextReservations = [...reservations, reservation];

    persistReservations(nextReservations);
    setReservations(nextReservations);
    setSelectedReservation(reservation);
    setBookingStep("qr");
  }

  function cancelReservation(reservationId: string) {
    const nextReservations = reservations.map((reservation) =>
      reservation.id === reservationId
        ? { ...reservation, status: "cancelled" as const }
        : reservation,
    );

    persistReservations(nextReservations);
    setReservations(nextReservations);
  }

  function openReservationQr(reservation: Reservation) {
    setSelectedReservation(reservation);
    setBookingStep("qr");
  }

  function changeTab(tab: TabId) {
    setBookingStep("tabs");
    setActiveTab(tab);
  }

  function selectParking(parking: Parking) {
    setSelectedParkingId(parking.id);
  }

  function handleFlowBack() {
    if (bookingStep === "summary") {
      backToDetail();
      return;
    }

    if (bookingStep === "qr") {
      backToReservations();
      return;
    }

    closeFlow();
  }

  return (
    <DriverLayout
      activeTab={activeTab}
      showBottomNav={bookingStep === "tabs"}
      onTabChange={changeTab}
    >
      {bookingStep === "detail" && (
        <ParkingDetailScreen
          parking={selectedParking}
          onReserve={openSummary}
          onBack={handleFlowBack}
        />
      )}
      {bookingStep === "summary" && (
        <BookingSummaryScreen
          parking={selectedParking}
          selection={bookingSelection}
          onPay={confirmPayment}
          onBack={handleFlowBack}
        />
      )}
      {bookingStep === "qr" && (
        <FinalQrScreen
          parking={qrParking}
          reservation={selectedReservation ?? activeReservation}
          onBack={handleFlowBack}
        />
      )}
      {bookingStep === "tabs" && (
        <>
          {activeTab === "inicio" && (
            <HomeScreen
              parking={selectedParking}
              parkings={parkingList}
              onReserve={openDetail}
              onSelectParking={selectParking}
            />
          )}
          {activeTab === "buscar" && (
            <SearchScreen
              parking={selectedParking}
              parkings={parkingList}
              onReserve={openDetail}
              onSelectParking={selectParking}
            />
          )}
          {activeTab === "reservas" && (
            <ReservationsScreen
              parking={reservationParking}
              activeReservations={activeReservations}
              reservationHistory={reservationHistory}
              maxActiveReservations={3}
              onReserve={openDetail}
              onCancel={cancelReservation}
              onOpenQr={openReservationQr}
            />
          )}
          {activeTab === "perfil" && <ProfileScreen />}
        </>
      )}
    </DriverLayout>
  );
}
