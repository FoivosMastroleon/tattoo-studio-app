import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { AppointmentDTO } from '../dto/appointment.dto'

const createTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  })

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('el-GR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export const sendNewBookingEmailToAdmin = async (apt: AppointmentDTO) => {
  if (!process.env.BREVO_USER || !process.env.BREVO_PASS || !process.env.ADMIN_EMAIL) return

  const token = jwt.sign({ appointmentId: apt.id }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' })
  const confirmUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/appointments/${apt.id}/confirm-via-email?token=${token}`

  const referenceSection = apt.referenceImageUrl
    ? `<p style="margin:8px 0"><strong>Reference Image:</strong> <a href="${apt.referenceImageUrl}" style="color:#c9a84c">View Image</a></p>`
    : ''

  const notesSection = apt.clientNotes
    ? `<p style="margin:8px 0"><strong>Notes:</strong> ${apt.clientNotes}</p>`
    : ''

  await createTransporter().sendMail({
    from: `"Ink & Soul" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking — ${apt.customer.username}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;padding:32px;border:1px solid #1a1a1a">
        <p style="color:#c9a84c;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 24px">Ink & Soul · New Appointment</p>
        <h2 style="font-size:22px;margin:0 0 24px;color:#e5e5e5">New Booking Request</h2>
        <div style="border-top:1px solid #1a1a1a;padding-top:20px">
          <p style="margin:8px 0"><strong>Customer:</strong> ${apt.customer.username}</p>
          <p style="margin:8px 0"><strong>Email:</strong> <a href="mailto:${apt.customer.email}" style="color:#c9a84c">${apt.customer.email}</a></p>
          ${apt.phone ? `<p style="margin:8px 0"><strong>Phone:</strong> ${apt.phone}</p>` : ''}
          <p style="margin:8px 0"><strong>Style:</strong> ${apt.tattooStyle.name}</p>
          <p style="margin:8px 0"><strong>Date:</strong> ${formatDate(apt.appointmentDate)}</p>
          <p style="margin:8px 0"><strong>Time:</strong> ${apt.timeSlot}</p>
          ${notesSection}
          ${referenceSection}
        </div>
        <div style="margin-top:28px">
          <a href="${confirmUrl}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;text-decoration:none;font-size:11px;font-family:sans-serif;letter-spacing:0.15em;text-transform:uppercase;padding:12px 28px">
            Confirm Appointment
          </a>
        </div>
        <p style="margin-top:32px;font-size:11px;color:#333">Ink & Soul Tattoo Studio · Athens, Greece</p>
      </div>
    `,
  })
}

export const sendConfirmationEmailToCustomer = async (apt: AppointmentDTO) => {
  if (!process.env.BREVO_USER || !process.env.BREVO_PASS) return

  const artistSection = apt.artist
    ? `<p style="margin:8px 0"><strong>Artist:</strong> ${apt.artist.username}</p>`
    : ''

  await createTransporter().sendMail({
    from: `"Ink & Soul" <${process.env.ADMIN_EMAIL}>`,
    to: apt.customer.email,
    subject: `Appointment Confirmed — ${formatDate(apt.appointmentDate)}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;padding:32px;border:1px solid #1a1a1a">
        <p style="color:#c9a84c;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 24px">Ink & Soul · Appointment Confirmed</p>
        <h2 style="font-size:22px;margin:0 0 8px;color:#e5e5e5">Your appointment is confirmed!</h2>
        <p style="color:#555;font-size:13px;margin:0 0 24px">Hi ${apt.customer.username}, we look forward to seeing you.</p>
        <div style="border-top:1px solid #1a1a1a;padding-top:20px">
          <p style="margin:8px 0"><strong>Style:</strong> ${apt.tattooStyle.name}</p>
          <p style="margin:8px 0"><strong>Date:</strong> ${formatDate(apt.appointmentDate)}</p>
          <p style="margin:8px 0"><strong>Time:</strong> ${apt.timeSlot}</p>
          ${artistSection}
        </div>
        <div style="border-top:1px solid #1a1a1a;margin-top:24px;padding-top:20px;color:#555;font-size:12px">
          <p style="margin:4px 0">Ermou 42 & Athinas, Athens 10563</p>
          <p style="margin:4px 0">T. +30 210 123 4567</p>
          <p style="margin:4px 0"><a href="mailto:info@inkandsoul.gr" style="color:#c9a84c">info@inkandsoul.gr</a></p>
        </div>
        <p style="margin-top:32px;font-size:11px;color:#333">Ink & Soul Tattoo Studio · Athens, Greece</p>
      </div>
    `,
  })
}
