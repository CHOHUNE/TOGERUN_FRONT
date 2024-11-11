import React from 'react';
import {useInView} from "react-intersection-observer";
import {useSpring,animated} from "react-spring";

function AnimatedRowComponent({children,rowIndex}) {


    // useInView : 화면에 보이는지 확인하는 hook
        // ref : 해당 엘리먼트를 가리키는 ref
        // inView : 화면에 보이면 true, 아니면 false
    const [ref, inView] = useInView({

        triggerOnce:true, // 한번만 실행,
        threshold:0.1 // 10% 정도 보이면 실행
    });

    const animationProps = useSpring({
        opacity:inView ? 1: 0,  // 뷰 안에 들어오면 1, 아니면 0
        transform: inView ? 'translateY(0)' : 'translateY(-50px)', // 뷰 안에 들어오면 0, 아니면 -50px
        delay: rowIndex * 100 // row 단위 delay
    })


    return (
        //animated: 스프링 애니메이션을 적용할 때 사용하는 컴포넌트
        <animated.div ref={ref} style={animationProps} className="w-full">
            {children}
        </animated.div>
    );
}

export default AnimatedRowComponent;