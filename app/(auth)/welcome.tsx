import OnboardingButton from "@/components/OnboardingButton";
import { onboarding } from "@/constants";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  const isFirstScreen = activeIndex === 0; // Check if it's the first screen

  return (
    <>
      <Swiper
        ref={swiperRef}
        loop={false}
        onIndexChanged={(index) => setActiveIndex(index)}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
      >
        {onboarding.map((item, index) => (
          <SafeAreaView
            key={item.id}
            className={`flex h-full justify-center ${
              index === 0 ? "" : "bg-white" // White background for other screens
            }`}
          >
            {item.id === 1 ? (
              <LinearGradient
                colors={["#294B74", "#05090E", "#000000"]}
                start={{ x: 1.8, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }} // Ensures the gradient fills the screen
              >
                <TouchableOpacity
                  onPress={() => {
                    router.replace("/(auth)/sign-up");
                  }}
                  className="w-full flex justify-end items-end p-5"
                >
                  <Text className="text-white text-md font-JakartaBold">
                    Skip
                  </Text>
                </TouchableOpacity>
                {/* This is the content for each screen */}
                <View className="flex items-center justify-center">
                  <Image
                    source={item.image}
                    className="w-full h-[300px]"
                    resizeMode="contain"
                  />
                  <View className="flex flex-row items-center justify-center w-full mt-10">
                    <Text className="text-white text-3xl font-bold mx-5 text-left">
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-lg font-JakartaSemiBold text-left text-[#959595] mx-5 mt-3">
                    {item.description}
                  </Text>
                </View>
              </LinearGradient>
            ) : (
              <View className="flex pb-10">
                <TouchableOpacity
                  onPress={() => {
                    router.replace("/(auth)/sign-up");
                  }}
                  className="w-full flex justify-end items-end p-5"
                >
                  <Text className="text-black text-md font-JakartaBold">
                    Skip
                  </Text>
                </TouchableOpacity>

                {/* This is the content for each screen */}
                <View className="flex items-center justify-center">
                  <Image
                    source={item.image}
                    className="w-full h-[300px]"
                    resizeMode="contain"
                  />
                  <View className="flex flex-row items-center justify-center w-full mt-10">
                    <Text className="text-black text-3xl font-bold mx-10 text-center">
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
                    {item.description}
                  </Text>
                </View>
              </View>
            )}
          </SafeAreaView>
        ))}
      </Swiper>
      <View>
        {/* Conditionally render based on whether it's the first screen */}
        {isFirstScreen ? (
          <View className="flex items-center bg-black">
            <OnboardingButton
              title={isLastSlide ? "Get Started" : "Next"}
              onPress={() =>
                isLastSlide
                  ? router.replace("/(auth)/sign-up")
                  : swiperRef.current?.scrollBy(1)
              }
              className="w-11/12 mt-10"
            />
          </View>
        ) : (
          <View className="flex items-center bg-white">
            <CustomButton
              title={isLastSlide ? "Get Started" : "Next"}
              onPress={() =>
                isLastSlide
                  ? router.replace("/(auth)/sign-up")
                  : swiperRef.current?.scrollBy(1)
              }
              className="w-11/12 mt-10"
            />
          </View>
        )}
      </View>
    </>
  );
};

export default Onboarding;
