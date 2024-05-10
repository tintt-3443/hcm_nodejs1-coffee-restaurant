import CronJob from 'node-cron';
import sgMail from '../../config/sendgrid.config';
import { InvoiceService } from '../../service/invoice.service';
import { STATUS_ORDER } from '../../constant/enum';

const invoiceService = new InvoiceService();
export const ininitScheduledJobs = async () => {
  const sendMailRevenue = CronJob.schedule('*/1 * * * *', async () => {
    const data = await invoiceService.statisticRevenue();
    const currentMonth_ = new Date().getMonth() + 1;
    const currentMonth = data?.find((s) => s.Month == currentMonth_);
    // sgMail
    //   .send({
    //     to: 'trantrongtin01012002@gmail.com',
    //     from: process.env.EMAIL!,
    //     templateId: process.env.SG_ACCOUNT_INFO_TEMPLATE_ID!,
    //     dynamicTemplateData: {
    //       month: currentMonth.Month,
    //       revenue: currentMonth.TotalRevenue,
    //     },
    //   })
    //   .then(() => {
    //     console.log('Email sent successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error sending email:', error);
    //   });
  });

  //   await sendMailRevenue.start();
};

// checkAndUpdateOrderStatus = async (invoiceId: number) => {
//   const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;
//   const autoUpdate = CronJob.schedule('*/30 * * * *', async () => {
//     const invoice = await this.invoiceRepository.findOne({
//       where: { id: invoiceId },
//     });

//     if (!invoice) {
//       return;
//     }

//     if (invoice.status === STATUS_ORDER.SHIPPING) {
//       const currentTime = new Date().getTime();
//       const shippingTime = invoice?.updated_at.getTime();
//       const timeDifference = currentTime - shippingTime;

//       if (timeDifference >= THIRTY_MINUTES_IN_MILLISECONDS) {
//         invoice.status = STATUS_ORDER.SUCCESS;
//         await this.invoiceRepository.save(invoice);
//       }
//     }
//   });
//   autoUpdate.start();
// };

export const UpdateStatusInvoice = async () => {
  const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000;
  const updateStatusInvoice = CronJob.schedule('*/60 * * * *', async () => {
    const invoices = await invoiceService.getAllOrders(STATUS_ORDER.SHIPPING);
    if (invoices) {
      const promises = invoices.map(async (invoice) => {
        const currentTime = new Date().getTime();
        const shippingTime = invoice?.updated_at.getTime();
        const timeDifference = currentTime - shippingTime;

        if (timeDifference >= THIRTY_MINUTES_IN_MILLISECONDS) {
          await invoiceService.updateStatusOrder(invoice.id, true);
        }
      });

      await Promise.all(promises);
    }
  });
  updateStatusInvoice.start();
};
