import React, {
    useEffect,
    useRef,
    useState
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


    // ==========================================
    // CHANGER DE SLIDE AUTOMATIQUEMENT
    // ==========================================

    useEffect(() => {

        console.log(
            "📱 Slide actuel:",
            currentSlide
        );


        const timer = setTimeout(() => {

            // Il reste des slides
            if (currentSlide < slides.length - 1) {

                const nextSlide = currentSlide + 1;

                console.log(
                    "➡️ Passage au slide:",
                    nextSlide
                );

                currentSlideRef.current = nextSlide;

                setCurrentSlide(nextSlide);

            }

            // Dernier slide
            else {

                console.log(
                    "✅ Dernier slide terminé"
                );

                console.log(
                    "➡️ Passage vers WelcomeScreen"
                );

                onFinish();

            }

        }, 2000);


        return () => clearTimeout(timer);

    }, [currentSlide]);


    // ==========================================
    // SLIDE SUIVANT
    // ==========================================

    const goToNextSlide = () => {

        if (currentSlideRef.current < slides.length - 1) {

            const nextSlide =
                currentSlideRef.current + 1;

            currentSlideRef.current = nextSlide;

            setCurrentSlide(nextSlide);

        }

    };


    // ==========================================
    // SLIDE PRÉCÉDENT
    // ==========================================

    const goToPreviousSlide = () => {

        if (currentSlideRef.current > 0) {

            const previousSlide =
                currentSlideRef.current - 1;

            currentSlideRef.current = previousSlide;

            setCurrentSlide(previousSlide);

        }

    };


    // ==========================================
    // SWIPE
    // ==========================================

    const panResponder = useRef(

        PanResponder.create({

            onMoveShouldSetPanResponder: (
                _,
                gestureState
            ) => {

                return Math.abs(
                    gestureState.dx
                ) > 20;

            },


            onPanResponderRelease: (
                _,
                gestureState
            ) => {

                const threshold = 50;


                // Swipe gauche
                if (
                    gestureState.dx <
                    -threshold
                ) {

                    goToNextSlide();

                }


                // Swipe droit
                else if (
                    gestureState.dx >
                    threshold
                ) {

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


                {/* PERSONNAGE */}

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