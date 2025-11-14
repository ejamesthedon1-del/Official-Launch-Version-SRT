import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";

interface PaymentFormProps {
  amount: number;
  address: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// Inner component that uses Stripe hooks
function PaymentFormInner({
  amount,
  address,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canUseApplePay, setCanUseApplePay] = useState(false);
  const paymentRequestButtonRef = useRef<HTMLDivElement>(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "make-server-52cdd920/create-payment-intent",
          {
            body: { amount, address },
          }
        );

        if (error) {
          console.error("Error creating payment intent:", error);
          toast.error("Failed to initialize payment");
          return;
        }

        if (data?.clientSecret && data?.paymentIntentId) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        }
      } catch (err) {
        console.error("Error creating payment intent:", err);
        toast.error("Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [amount, address]);

  // Initialize Apple Pay / Payment Request
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Smart Realtor Tool - One-time Payment',
        amount: amount * 100, // Amount in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanUseApplePay(true);
      }
    });

    pr.on('paymentmethod', async (ev) => {
      setLoading(true);
      
      try {
        // Confirm payment with the payment method from Apple Pay
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: ev.paymentMethod.id,
          },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          toast.error(confirmError.message || "Payment failed");
          setLoading(false);
          return;
        }

        // Verify payment on backend
        if (paymentIntent?.id) {
          const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
            "make-server-52cdd920/verify-payment",
            {
              body: { paymentIntentId: paymentIntent.id },
            }
          );

          if (verifyError || !verifyData?.success) {
            ev.complete('fail');
            toast.error("Payment verification failed");
            setLoading(false);
            return;
          }
        }

        ev.complete('success');
        toast.success("Payment successful!");
        onSuccess();
      } catch (error) {
        ev.complete('fail');
        console.error("Apple Pay payment error:", error);
        toast.error(error instanceof Error ? error.message : "Payment failed");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, [stripe, clientSecret, amount, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment system not ready. Please wait...");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        console.error("Payment confirmation error:", confirmError);
        toast.error(confirmError.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Verify payment on backend
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
          "make-server-52cdd920/verify-payment",
          {
            body: { paymentIntentId: paymentIntent.id },
          }
        );

        if (verifyError || !verifyData?.success) {
          console.error("Payment verification error:", verifyError);
          toast.error("Payment verification failed");
          setLoading(false);
          return;
        }

        toast.success("Payment successful!");
        onSuccess();
      } else {
        toast.error(`Payment status: ${paymentIntent?.status}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Apple Pay / Payment Request Button */}
      {canUseApplePay && paymentRequest && (
        <div className="space-y-2">
          <Label>Quick Pay</Label>
          <div ref={paymentRequestButtonRef} className="payment-request-button">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    theme: 'dark',
                    height: '48px',
                  },
                },
              }}
            />
          </div>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="px-3 text-xs text-muted-foreground">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Card Details</Label>
        <div className="p-3 border rounded-md bg-background">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <Button type="submit" className="w-full" size="lg" disabled={loading || !clientSecret}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>Pay ${amount}</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </div>
    </form>
  );
}

// Wrapper component with Elements provider
export function PaymentForm(props: PaymentFormProps) {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="p-4 border rounded-md bg-destructive/10">
        <p className="text-sm text-destructive">
          Stripe publishable key not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
