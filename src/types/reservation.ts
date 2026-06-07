export type ReservationStatus = "active" | "cancelled";

export type Reservation = {
  id: string;
  parkingId: string;
  userId: string;
  parkingName: string;
  parkingAddress: string;
  parkingImage: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  total: number;
  paymentMethod: string;
  code: string;
  status: ReservationStatus;
};
