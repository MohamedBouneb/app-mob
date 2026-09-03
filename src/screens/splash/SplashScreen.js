import React, {
    useState,
    useRef,
    useEffect
} from "react";

import {
    View,
    Text,
    Image,
    StyleSheet,
    PanResponder,
    TouchableOpacity
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


    /*
    ========================================
    PASSER AU SLIDE SUIVANT
    ========================================
    */

    const goToNextSlide = () => {

        // Autorise à aller jusqu'à slides.length (l'écran final)
        if (currentSlideRef.current < slides.length) {

            const nextSlide =
                currentSlideRef.current + 1;

            currentSlideRef.current = nextSlide;

            setCurrentSlide(nextSlide);

        }

    };


    /*
    ========================================
    REVENIR AU SLIDE PRECEDENT
    ========================================
    */

    const goToPreviousSlide = () => {

        if (currentSlideRef.current > 0) {

            const previousSlide =
                currentSlideRef.current - 1;

            currentSlideRef.current = previousSlide;

            setCurrentSlide(previousSlide);

        }

    };


    /*
    ========================================
    AUTO SLIDE
    ========================================

    Les 3 premiers slides défilent automatiquement (2s).

    Le dernier slide (index 2) NE défile PAS automatiquement
    vers l'écran final : il faut un swipe (ou un tap, voir plus bas).
    */

    useEffect(() => {

    const timer = setTimeout(() => {

        if (currentSlide < slides.length - 1) {

            setCurrentSlide(currentSlide + 1);

        } else {

            onFinish();

        }

    }, 2000);

    return () => clearTimeout(timer);

}, [currentSlide]);

    /*
    ========================================
    SWIPE
    ========================================
    */

    const panResponder = useRef(

        PanResponder.create({

            onMoveShouldSetPanResponder:
                (_, gestureState) => {

                    return Math.abs(gestureState.dx) > 20;

                },


            onPanResponderRelease:
                (_, gestureState) => {

                    const SWIPE_THRESHOLD = 50;


                    // Swipe gauche
                    if (
                        gestureState.dx 
                        -SWIPE_THRESHOLD
                    ) {

                        goToNextSlide();

                    }


                    // Swipe droit
                    else if (
                        gestureState.dx >
                        SWIPE_THRESHOLD
                    ) {

                        goToPreviousSlide();

                    }

                },

        })

    ).current;


    /*
    ========================================
    TAP DE SECOURS (utile en test, notamment sur web
    où le swipe à la souris est peu fiable)
    ========================================
    */

    const handleTapOnLastSlide = () => {

        if (currentSlide === slides.length - 1) {

            goToNextSlide();

        }

    };


    /*
    ========================================
    SI ON ARRIVE AU DERNIER ÉCRAN
    ========================================
    */

    if (currentSlide >= slides.length) {

        return (

            <View style={styles.container}>

                {/* IMAGE */}

                <Image
                    source={require(
                        "../../assets/images/splash/welcome-child.png"
                    )}
                    style={styles.welcomeImage}
                    resizeMode="contain"
                />


                {/* BOUTON LOGIN */}

                <TouchableOpacity
                    style={styles.choiceButton}
                    onPress={() => onFinish("login")}
                    activeOpacity={0.8}
                >

                    <Text style={styles.choiceText}>
                        تسجيل الدخول
                    </Text>

                </TouchableOpacity>


                {/* BOUTON REGISTER */}

                <TouchableOpacity
                    style={styles.choiceButton}
                    onPress={() => onFinish("register")}
                    activeOpacity={0.8}
                >

                    <Text style={styles.choiceText}>
                        إنشاء حساب
                    </Text>

                </TouchableOpacity>


                {/* DESCRIPTION */}

                <View style={styles.descriptionBox}>

                    <Text style={styles.description}>

                        الروضة هي محطة شحن صغيرة
                        {"\n"}
                        للأرواح الصغيرة قبل انطلاقها في الحياة

                    </Text>


                    <Image
                        source={require(
                            "../../assets/images/splash/child-3.png"
                        )}
                        style={styles.smallCharacter}
                        resizeMode="contain"
                    />

                </View>

            </View>

        );

    }


    const slide = slides[currentSlide];


    /*
    ========================================
    SLIDES 1, 2, 3
    ========================================
    */

    return (

        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={handleTapOnLastSlide}
            {...panResponder.panHandlers}
        >

            {/* LOGO */}

            <Image
                source={require(
                    "../../assets/images/logo-jardin.png"
                )}
                style={styles.logo}
                resizeMode="contain"
            />


            {/* TITRE */}

            <Text style={styles.title}>

                {slide.title}

            </Text>


            {/* DESCRIPTION */}

            <View style={styles.descriptionBox}>

                <Text style={styles.description}>

                    {slide.description}

                </Text>


                <Image
                    source={slide.character}
                    style={styles.character}
                    resizeMode="contain"
                />

            </View>


            {/* DOTS */}

            <View style={styles.dotsContainer}>

                {slides.map((_, index) => (

                    <View
                        key={index}
                        style={[
                            styles.dot,

                            index === currentSlide
                                ? styles.activeDot
                                : styles.inactiveDot
                        ]}
                    />

                ))}

            </View>

        </TouchableOpacity>

    );

}


/*
========================================
STYLES
========================================
*/

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: "#F52F46",

        alignItems: "center",

        paddingHorizontal: 20,

        paddingTop: 50,

    },


    /*
    LOGO
    */

    logo: {

        width: 220,

        height: 220,

        marginTop: 70,

    },


    /*
    TITRE
    */

    title: {

        color: "#FFFFFF",

        fontSize: 28,

        fontWeight: "400",

        marginTop: 30,

        textAlign: "center",

        writingDirection: "rtl",

    },


    /*
    IMAGE DU DERNIER SLIDE
    */

    welcomeImage: {

        width: 290,

        height: 270,

        marginTop: 45,

    },


    /*
    BOUTONS LOGIN / REGISTER
    */

    choiceButton: {

        width: "82%",

        height: 50,

        backgroundColor: "#FFA936",

        borderRadius: 30,

        justifyContent: "center",

        alignItems: "center",

        marginTop: 18,

    },


    choiceText: {

        color: "#FFFFFF",

        fontSize: 18,

        fontWeight: "bold",

        writingDirection: "rtl",

    },


    /*
    DESCRIPTION
    */

    descriptionBox: {

        width: "92%",

        minHeight: 70,

        backgroundColor: "#FFFFFF",

        borderRadius: 18,

        marginTop: "auto",

        marginBottom: 25,

        paddingHorizontal: 20,

        paddingVertical: 15,

        justifyContent: "center",

        alignItems: "center",

        position: "relative",

    },


    description: {

        color: "#E85A24",

        fontSize: 14,

        lineHeight: 20,

        textAlign: "center",

        writingDirection: "rtl",

        paddingHorizontal: 10,

    },


    /*
    PERSONNAGE DES SLIDES 1-3
    */

    character: {

        position: "absolute",

        right: -5,

        bottom: -10,

        width: 80,

        height: 90,

    },


    /*
    PERSONNAGE DU DERNIER SLIDE
    */

    smallCharacter: {

        position: "absolute",

        right: -5,

        bottom: -10,

        width: 85,

        height: 95,

    },


    /*
    DOTS
    */

    dotsContainer: {

        flexDirection: "row",

        justifyContent: "center",

        alignItems: "center",

        gap: 5,

        marginBottom: 20,

    },


    dot: {

        height: 7,

        borderRadius: 10,

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