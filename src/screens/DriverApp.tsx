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
import { ScheduleSelectionScreen } from "./ScheduleSelectionScreen";
import { SearchScreen } from "./SearchScreen";

const initialParkings = parkings as Parking[];
type BookingStep = "tabs" | "detail" | "schedule" | "summary" | "qr";
const RESERVATION_STORAGE_KEY = "parkonba.reservations";
const PARKING_STORAGE_KEY = "parkonba.parkings";
const MAX_ACTIVE_RESERVATIONS = 3;
const MONTH_INDEX_BY_NAME: Record<string, number> = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  setiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

function readStoredParkings(): Parking[] {
  const storedParkings = window.localStorage.getItem(PARKING_STORAGE_KEY);

  if (!storedParkings) {
    return initialParkings;
  }

  try {
    const parsedParkings = JSON.parse(storedParkings) as Parking[];

    return initialParkings.map((parking) => ({
      ...parking,
      disponibilidad:
        parsedParkings.find((storedParking) => storedParking.id === parking.id)
          ?.disponibilidad ?? parking.disponibilidad,
    }));
  } catch {
    return initialParkings;
  }
}

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

function persistParkings(nextParkings: Parking[]) {
  window.localStorage.setItem(PARKING_STORAGE_KEY, JSON.stringify(nextParkings));
}

function getReservationEndDate(reservation: Reservation) {
  const startDate = reservation.dateISO
    ? new Date(reservation.dateISO)
    : parseReservationStartDate(reservation);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + reservation.durationHours);

  return endDate;
}

function parseReservationStartDate(reservation: Reservation) {
  const dateMatch = reservation.dateLabel
    .toLowerCase()
    .match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)/i);
  const [hour, minute] = reservation.startTime.split(":").map(Number);

  if (!dateMatch || Number.isNaN(hour) || Number.isNaN(minute)) {
    return new Date(Number.NaN);
  }

  const day = Number(dateMatch[1]);
  const monthName = dateMatch[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const monthIndex = MONTH_INDEX_BY_NAME[monthName];

  if (monthIndex === undefined) {
    return new Date(Number.NaN);
  }

  const startDate = new Date();
  startDate.setMonth(monthIndex, day);
  startDate.setHours(hour, minute, 0, 0);

  return startDate;
}

function isReservationCurrent(reservation: Reservation) {
  const endDate = getReservationEndDate(reservation);

  if (!endDate) {
    return true;
  }

  return endDate.getTime() > Date.now();
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
    dateISO: startDate.toISOString(),
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
  const [parkingList, setParkingList] = useState<Parking[]>(() =>
    readStoredParkings(),
  );
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
    (reservation) =>
      reservation.status === "active" && isReservationCurrent(reservation),
  );
  const reservationHistory = userReservations.filter(
    (reservation) =>
      reservation.status !== "active" || !isReservationCurrent(reservation),
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

  function redirectToReservationLimit() {
    setBookingStep("tabs");
    setActiveTab("reservas");
  }

  function openDetail() {
    if (activeReservations.length >= MAX_ACTIVE_RESERVATIONS) {
      redirectToReservationLimit();
      return;
    }

    setBookingStep("detail");
  }

  function openSchedule() {
    if (activeReservations.length >= MAX_ACTIVE_RESERVATIONS) {
      redirectToReservationLimit();
      return;
    }

    setBookingStep("schedule");
  }

  function closeFlow() {
    setBookingStep("tabs");
  }

  function backToDetail() {
    setBookingStep("detail");
  }

  function backToSchedule() {
    setBookingStep("schedule");
  }

  function backToReservations() {
    setBookingStep("tabs");
    setActiveTab("reservas");
  }

  function backToHome() {
    setBookingStep("tabs");
    setActiveTab("inicio");
  }

  function openSummary(selection: BookingSelection) {
    setBookingSelection(selection);
    setBookingStep("summary");
  }

  function confirmPayment(paymentMethod: string) {
    if (!currentUser) {
      return;
    }

    if (selectedParking.disponibilidad <= 0) {
      setBookingStep("tabs");
      setActiveTab("buscar");
      return;
    }

    if (activeReservations.length >= MAX_ACTIVE_RESERVATIONS) {
      redirectToReservationLimit();
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
      dateISO: bookingSelection?.dateISO ?? fallbackBooking.dateISO,
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
    setParkingList((currentParkings) => {
      const nextParkings = currentParkings.map((parking) =>
        parking.id === selectedParking.id
          ? {
              ...parking,
              disponibilidad: Math.max(0, parking.disponibilidad - 1),
            }
          : parking,
      );

      persistParkings(nextParkings);
      return nextParkings;
    });
    setSelectedReservation(reservation);
    setBookingStep("qr");
  }

  function cancelReservation(reservationId: string) {
    const cancelledReservation = reservations.find(
      (reservation) =>
        reservation.id === reservationId && reservation.status === "active",
    );
    const nextReservations = reservations.map((reservation) =>
      reservation.id === reservationId
        ? { ...reservation, status: "cancelled" as const }
        : reservation,
    );

    persistReservations(nextReservations);
    setReservations(nextReservations);

    if (cancelledReservation) {
      setParkingList((currentParkings) => {
        const nextParkings = currentParkings.map((parking) =>
          parking.id === cancelledReservation.parkingId
            ? { ...parking, disponibilidad: parking.disponibilidad + 1 }
            : parking,
        );

        persistParkings(nextParkings);
        return nextParkings;
      });
    }
  }

  function changeTab(tab: TabId) {
    setBookingStep("tabs");
    setActiveTab(tab);
  }

  function selectParking(parking: Parking) {
    setSelectedParkingId(parking.id);
  }

  function openExplore() {
    setBookingStep("tabs");
    setActiveTab("buscar");
  }

  function handleFlowBack() {
    if (bookingStep === "summary") {
      backToSchedule();
      return;
    }

    if (bookingStep === "schedule") {
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
      showHeader={bookingStep === "tabs"}
      showBottomNav={bookingStep === "tabs"}
      onTabChange={changeTab}
    >
      {bookingStep === "detail" && (
        <ParkingDetailScreen
          parking={selectedParking}
          onReserve={openSchedule}
          onBack={handleFlowBack}
        />
      )}
      {bookingStep === "schedule" && (
        <ScheduleSelectionScreen
          parking={selectedParking}
          onContinue={openSummary}
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
          onOpenReservations={backToReservations}
          onGoHome={backToHome}
        />
      )}
      {bookingStep === "tabs" && (
        <>
          {activeTab === "inicio" && (
            <HomeScreen
              parking={selectedParking}
              parkings={parkingList}
              onExplore={openExplore}
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
              maxActiveReservations={MAX_ACTIVE_RESERVATIONS}
              onReserve={openExplore}
              onCancel={cancelReservation}
            />
          )}
          {activeTab === "perfil" && <ProfileScreen />}
        </>
      )}
    </DriverLayout>
  );
}
