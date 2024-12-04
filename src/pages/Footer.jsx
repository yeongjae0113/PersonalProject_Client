import React from 'react';
import Style from '../css/Footer.module.css';
import Facebook from '../img/Facebook.svg';
import Youtube from '../img/Youtube.svg';
import NaverCafe from '../img/NaverCafe.svg';
import Naver from '../img/Naver.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className={Style.footerFrame}>
            <div className={Style.footerTop}>
                <div className={Style.footerInfo}>
                    <p className={Style.footerInfoTitle}>(주)개인프로젝트 사업자 정보</p>
                    <p>(주)개인프로젝트 | 대표자 : 최영재</p>
                    <p>사업자 등록번호 : 010-6605-7937</p>
                    <p>주소 : 서울특별시 강남구 테헤란로 26길 12 제일비전타워 13층</p>
                    <p>대표번호 : 1588-5890</p>
                    <p>메일 : dudwo0113@gmail.com</p>
                </div>
                <div className={Style.socialIconList}>
                    <Link to='https://www.facebook.com'><img src={Facebook} alt='Facebook'/></Link>
                    <Link to='https://www.youtube.com'><img src={Youtube} alt='Youtube'/></Link>
                    <Link to='https://section.cafe.naver.com/ca-fe/home'><img src={NaverCafe} alt='NaverCafe'/></Link>
                    <Link to='https://www.naver.com'><img src={Naver} alt='Naver'/></Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
