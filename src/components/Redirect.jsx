import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const Redirection = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
        // 비동기 작업을 처리할 함수 정의
        const fetchToken = async () => {
            const code = new URL(window.location.href).searchParams.get("code");
            const grant_type = 'authorization_code'
            const client_id = `${process.env.REACT_APP_REST_API_KEY}`
            const AUTHORIZE_CODE = code
            console.log(code)

            try {
                // code를 통해 토큰값 요청 axios 명령
                const res = await axios.post(
                    `https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${client_id}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&code=${AUTHORIZE_CODE}`,
                    {
                      headers: {
                        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                      },
                    },
                  )

                // response에서 access_token 추출
                const token = res.data.access_token;
                console.log("token : ", token);
                // 토큰으로 사용자 정보 추출
                const kakaoUser = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                })
                localStorage.setItem('accessToken',token);
                console.log("회원정보:"+kakaoUser.data)
                console.log(kakaoUser.data.kakao_account.profile.nickname)

                // 다 끝났으면 메인 페이지로 복귀
                navigate('/');
            } catch (error) {
                console.error("토큰 요청 오류:", error);
            }
        };

        fetchToken();  // 비동기 함수 호출
    }, [navigate]);  // 의존성 배열에 navigate 추가 (useNavigate가 외부에서 전달되므로)

    return <div>로그인 중입니다.</div>;
};
  
export default Redirection;