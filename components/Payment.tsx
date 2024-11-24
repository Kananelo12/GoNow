import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { useStripe } from "@stripe/stripe-react-native";
import { Alert, Image, Text, View } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";

import { useLocationStore } from "@/store";
import { useAuth } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import { images } from "@/constants";
import { router } from "expo-router";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { userId } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);

  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "GoNow Inc.",
      intentConfiguration: {
        mode: {
          amount: parseInt(amount) * 100,
          currencyCode: "zar",
        },
        confirmHandler: async (
          paymentMethod,
          shouldSavePaymentMethod,
          intentCreationCallback,
        ) => {
          try {
            // Make a request to your own server.
            const { paymentIntent, customer } = await fetchAPI(
              "/(api)/(stripe)/create",
              {
                method: "POST",
                headers: {
                  "content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: fullName || email.split("@")[0],
                  email: email,
                  amount: amount,
                  paymentMethodId: paymentMethod.id,
                }),
              }
            );

            if (paymentIntent.client_secret) {
              const { result } = await fetchAPI("/(api)/(stripe)/pay", {
                method: "POST",
                headers: {
                  "content-Type": "application/json",
                },
                body: JSON.stringify({
                  payment_method_id: paymentMethod.id,
                  payment_intent_id: paymentIntent.id,
                  customer_id: customer,
                  client_secret: paymentIntent.client_secret,
                }),
              });

              // create a ride if it exists
              if (result.client_secret) {
                // call to a new api route
                await fetchAPI("/(api)/ride/create", {
                  method: "POST",
                  headers: {
                    "content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    origin_address: userAddress,
                    destination_address: destinationAddress,
                    origin_latitude: userLatitude,
                    origin_longitude: userLongitude,
                    destination_latitude: destinationLatitude,
                    destination_longitude: destinationLongitude,
                    ride_time: rideTime.toFixed(0),
                    fare_price: parseInt(amount) * 100,
                    payment_status: "paid",
                    driver_id: driverId,
                    user_id: userId,
                  }),
                });

                intentCreationCallback({
                  clientSecret: result.client_secret,
                });
              }
            }
          } catch (error) {
            console.error("Payment Handler Error:", error);
            Alert.alert(`Error code: ${error}`);
          }
        },
      },
      returnURL: "myapp://book-ride",
    });
    
    if (error) {
      // handle error
      console.error("Payment Sheet Initialization Error:", error.message);
      Alert.alert(
        "Payment Error",
        "There was an issue initializing the payment sheet. Please try again."
      );
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      // Customer canceled - you should probably do nothing.
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      // Payment completed - show a confirmation screen.
      setSuccess(true);
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />

      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
          <Image source={images.check} className="w-28 h-28 mt-5" />
          <Text className="text-2xl text-center font-JakartaBold mt-5">
            Ride Booked
          </Text>
          <Text className="text-md text-center text-general-200 font-JakartaMedium mt-3">
            Thank you for your booking. Your reservation has been placed. Please
            proceed with your trip!
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              router.push("/(root)/(tabs)/home");
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
