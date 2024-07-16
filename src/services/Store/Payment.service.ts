import { InternalServerError } from "../../utils/Error";
import prisma from "../../dbConfig";
import { COUNTRY_CODE, CURRENCY, MESSAGES } from "../../utils/Constant";
import Stripe from "stripe";
import { updateStoreById } from "../../dbConfig/queries/Store.query";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
class PaymentService {
  async linkBankAccount(
    accountHolderName: string,
    accountNumber: string,
    transitNumber: string,
    institutionNumber: string,
    email: string,
    ip: string | undefined,
    storeId: string
  ) {
    try {
      const routingNumber = `${institutionNumber}${transitNumber}`;

      const account = await stripe.accounts.create({
        type: "custom",
        country: COUNTRY_CODE.CA,
        email: email,
        business_type: "individual",
        individual: {
          first_name: accountHolderName.split(" ")[0],
          last_name: accountHolderName.split(" ")[1],
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        external_account: {
          object: "bank_account",
          country: COUNTRY_CODE.CA,
          currency: CURRENCY.CAD,
          account_number: accountNumber,
          routing_number: routingNumber,
        },
      });

      if (account.id) {
        await updateStoreById(storeId, { stripeAccountId: account.id });
        return account;
      } else {
        return null;
      }
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
  async getBankAccount(storeId: string) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store?.stripeAccountId) {
      return null;
    }
    const account = await stripe.accounts.retrieve(store.stripeAccountId);
    return account;
  }
  async unlinkBankAccount(storeId: string) {
    try {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store?.stripeAccountId) {
        throw new InternalServerError(MESSAGES.NO_STRIPE_ACCOUNT_LINKED);
      }
      await stripe.accounts.del(store.stripeAccountId);
      await updateStoreById(storeId, { stripeAccountId: null });
    } catch (error: any) {
      throw new InternalServerError(error.message);
    }
  }
}
export default PaymentService;
