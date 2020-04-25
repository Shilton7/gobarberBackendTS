import { isEqual } from 'date-fns';
import AppointmentModel from '../models/Appointment';

class AppointmentsRepository {
  private appointments: AppointmentModel[];

  constructor() {
    this.appointments = [];
  }

  public all(): AppointmentModel[] {
    return this.appointments;
  }

  public create(provider: string, date: Date): AppointmentModel {
    const appointment = new AppointmentModel(provider, date);

    this.appointments.push(appointment);

    return appointment;
  }

  public findByDate(date: Date): AppointmentModel | null {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date)
    );

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
