import { InternalServerError } from "../../utils/Error";
import { getUserStripeCustomerId } from "../../dbConfig/queries/User/User.query";
import Stripe from "stripe";
import { MESSAGES } from "../../utils/Constant";
import prisma from "../../dbConfig";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
class PaymentService {
  async getPaymentMethods(userId: string) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }
    const paymentMethods = user.stripeCustomerId
      ? await stripe.paymentMethods.list({
          customer: user.stripeCustomerId as string,
          type: "card",
        })
      : [];
    const paymentMethodIds = user.paymentMethodId;
    return {
      paymentMethods,
      defaultPaymentMethod: paymentMethodIds,
    };
  }
  async addNewPaymentMethod(userId: string, paymentMethodId: string) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
      });

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id, paymentMethodId },
      });
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });
      if (!user.paymentMethodId) {
        await prisma.user.update({
          where: { id: userId },
          data: { paymentMethodId },
        });
      }
    }
  }
  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }
    await stripe.customers.update(user?.stripeCustomerId as string, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { paymentMethodId },
    });
  }
  async removePaymentMethod(userId: string, paymentMethodId: string) {
    const user = await getUserStripeCustomerId(userId);
    if (!user) {
      throw new InternalServerError(MESSAGES.USER_NOT_FOUND);
    }
    await stripe.paymentMethods.detach(paymentMethodId);
    await prisma.user.update({
      where: { id: userId },
      data: { paymentMethodId: null },
    });
  }
}
export default PaymentService;
