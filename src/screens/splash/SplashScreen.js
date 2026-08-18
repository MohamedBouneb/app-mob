import React, {
    useState,
    useRef
} from "react";

import {
    View,
    Text,
    Image,
    StyleSheet,
    PanResponder,
} from "react-native";


const slides = [

    {
        title: "مرحبا ...",

        description:
            "نرحب بأطفالكم في روضة المستقبل، الواقعة بمدينة مساكن.",

        character:
            require("../../assets/images/splash/child-1.png"),
    },

    {
        title: "تحميل ...",

        description:
            "تُعدّ هذه الروضة من أبرز رياض الأطفال في مدينة مساكن",

        character:
            require("../../assets/images/splash/child-2.png"),
    },

    {
        title: "مرحبا ...",

        description:
            "الروضة هي محطة شحن صغيرة للأرواح الصغيرة قبل انطلاقها في الحياة",

        character:
            require("../../assets/images/splash/child-3.png"),
    },

];


export default function SplashScreen({ onFinish }) {

    const [currentSlide, setCurrentSlide] = useState(0);

    const currentSlideRef = useRef(0);


    const goToNextSlide = () => {

        if (currentSlideRef.current < slides.length - 1) {

            const nextSlide = currentSlideRef.current + 1;

            currentSlideRef.current = nextSlide;

            setCurrentSlide(nextSlide);

        } else {

            onFinish();

        }

    };


    const goToPreviousSlide = () => {

        if (currentSlideRef.current > 0) {

            const previousSlide = currentSlideRef.current - 1;

            currentSlideRef.current = previousSlide;

            setCurrentSlide(previousSlide);

        }

    };


    const panResponder = useRef(

        PanResponder.create({

            onMoveShouldSetPanResponder: (_, gestureState) => {

                return Math.abs(gestureState.dx) > 20;

            },


            onPanResponderRelease: (_, gestureState) => {

                const SWIPE_THRESHOLD = 50;


                if (gestureState.dx < -SWIPE_THRESHOLD) {

                    goToNextSlide();

                }


                else if (gestureState.dx > SWIPE_THRESHOLD) {

                    goToPreviousSlide();

                }

            },

        })

    ).current;


    const slide = slides[currentSlide];


    return (

        <View
            style={styles.container}
            {...panResponder.panHandlers}
        >

            {/* Logo */}
            <Image
                source={require(
                    "../../assets/images/logo-jardin.png"
                )}
                style={styles.logo}
                resizeMode="contain"
            />


            {/* Titre */}
            <Text style={styles.title}>
                {slide.title}
            </Text>


            {/* Description */}
            <View style={styles.descriptionBox}>

                <Text style={styles.description}>
                    {slide.description}
                </Text>


                {/* Personnage */}
                <Image
                    source={slide.character}
                    style={styles.character}
                    resizeMode="contain"
                />

            </View>


            {/* Indicateurs */}
            <View style={styles.dotsContainer}>

                {slides.map((_, index) => (

                    <View
                        key={index}
                        style={[
                            styles.dot,

                            index === currentSlide
                                ? styles.activeDot
                                : styles.inactiveDot,
                        ]}
                    />

                ))}

            </View>

        </View>

    );

}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F52F46",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 70,
    },

    logo: {
        width: 220,
        height: 220,
        marginTop: 80,
    },

    title: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "400",
        marginTop: 35,
        textAlign: "center",
        writingDirection: "rtl",
    },

    descriptionBox: {
        width: "92%",
        minHeight: 75,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        marginTop: "auto",
        marginBottom: 30,
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },

    description: {
        color: "#E85A24",
        fontSize: 14,
        lineHeight: 21,
        textAlign: "center",
        writingDirection: "rtl",
        paddingHorizontal: 10,
    },

    character: {
        position: "absolute",
        right: -5,
        bottom: -10,
        width: 80,
        height: 90,
    },

    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginBottom: 20,
    },

    dot: {
        width: 10,
        height: 7,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
    },

    activeDot: {
        width: 24,
        backgroundColor: "#FFD83D",
    },

    inactiveDot: {
        width: 10,
        backgroundColor: "#FFFFFF",
    },

});