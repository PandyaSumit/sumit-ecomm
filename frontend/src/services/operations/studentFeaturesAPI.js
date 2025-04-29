import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

// ================ buyCourse ================
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Processing payment...");

    try {
        // Simulate order creation (mock)
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
            { coursesId },
            {
                Authorization: `Bearer ${token}`,
            });

        if (!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        // Simulate payment success
        const mockPaymentResponse = {
            razorpay_order_id: "MOCK_ORDER_ID",
            razorpay_payment_id: "MOCK_PAYMENT_ID",
            razorpay_signature: "MOCK_SIGNATURE"
        };

        // Send payment success email
        await sendPaymentSuccessEmail(mockPaymentResponse, orderResponse.data.message.amount, token);

        // Verify payment and enroll user
        await verifyPayment({ ...mockPaymentResponse, coursesId }, token, navigate, dispatch);

    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error(error?.response?.data?.message || "Payment failed");
    }

    toast.dismiss(toastId);
}

// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        });
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));

    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful! You are enrolled.");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify payment");
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
