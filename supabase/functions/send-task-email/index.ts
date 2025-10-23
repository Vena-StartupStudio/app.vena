import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { corsHeaders } from "../_shared/cors.ts"

interface TaskEmailRequest {
  taskId: string;
  clientEmail: string;
  clientName: string;
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string;
  status: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { taskId, clientEmail, clientName, taskTitle, taskDescription, dueDate, status }: TaskEmailRequest = await req.json()

    if (!taskId || !clientEmail || !clientName || !taskTitle) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: taskId, clientEmail, clientName, taskTitle' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role key
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Service role key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      supabaseServiceRoleKey
    )

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Email configuration
    const emailFrom = Deno.env.get('SMTP_FROM_EMAIL') || 'noreply@vena.software'
    const emailSubject = `Task Update: ${taskTitle}`

    // Create email content based on status
    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #8B5CF6;">Vena Task Management</h2>
        <p>Hi ${clientName},</p>
        <p>Your task status has been updated:</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${taskTitle}</h3>
    `

    if (taskDescription) {
      emailContent += `<p style="margin: 0 0 10px 0; color: #666;">${taskDescription}</p>`
    }

    if (dueDate) {
      emailContent += `<p style="margin: 0 0 10px 0; color: #666;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>`
    }

    // Add status-specific messaging
    switch (status.toLowerCase()) {
      case 'done':
        emailContent += `<p style="margin: 10px 0; color: #10B981;"><strong>Status:</strong> ✅ Completed</p>`
        emailContent += `<p>Great job! This task has been marked as completed.</p>`
        break
      case 'pending':
        emailContent += `<p style="margin: 10px 0; color: #F59E0B;"><strong>Status:</strong> ⏳ Pending</p>`
        emailContent += `<p>This task is still pending. Please complete it when you have a chance.</p>`
        break
      case 'missed':
        emailContent += `<p style="margin: 10px 0; color: #EF4444;"><strong>Status:</strong> ❌ Missed</p>`
        emailContent += `<p>This task deadline has passed. Please complete it as soon as possible.</p>`
        break
      case 'reminder sent':
        emailContent += `<p style="margin: 10px 0; color: #3B82F6;"><strong>Status:</strong> 📧 Reminder Sent</p>`
        emailContent += `<p>This is a friendly reminder about your pending task.</p>`
        break
      default:
        emailContent += `<p style="margin: 10px 0; color: #6B7280;"><strong>Status:</strong> ${status}</p>`
    }

    emailContent += `
        </div>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br>Your Vena Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          This email was sent from Vena Task Management System
        </p>
      </div>
    `

    // Send email using SMTP
    const smtpHost = Deno.env.get('SMTP_HOST')
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587')
    const smtpUser = Deno.env.get('SMTP_USER')
    const smtpPass = Deno.env.get('SMTP_PASS')

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP not configured, logging email instead of sending')
      console.log('Email that would be sent:', {
        to: clientEmail,
        from: emailFrom,
        subject: emailSubject,
        html: emailContent
      })

      // Still update the database to mark email as sent
      await supabase
        .from('client_tasks')
        .update({
          status: status === 'reminder sent' ? 'Reminder Sent' : status,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

      return new Response(
        JSON.stringify({
          message: 'Email logged (SMTP not configured)',
          emailData: {
            to: clientEmail,
            subject: emailSubject,
            content: emailContent
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send actual email via SMTP
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [clientEmail],
        subject: emailSubject,
        html: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Email service error:', errorText)

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    // Update the database to reflect the email was sent
    await supabase
      .from('client_tasks')
      .update({
        status: status === 'reminder sent' ? 'Reminder Sent' : status,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)

    return new Response(
      JSON.stringify({
        message: 'Task email sent successfully',
        emailId: emailResult.id,
        taskId: taskId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
