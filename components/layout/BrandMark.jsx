"use client";

import { FaHeart } from "react-icons/fa";

const BrandMark = () => {
  const colors = {
    primary: "#fff",
    secondary: "#fff",
  };

  return (
    <>
      {/* ========== FAVFLY ========= */}
      <div className="favfly pb-3">
        <div className="divider-icon pt-0 m-0 border-0 position-relative">
          <i className="fa">
            <FaHeart />
          </i>
        </div>
        <a
          target="_blank"
          // nofollow: a sitewide footer credit must not pass link equity
          // (SEO audit BL6); noopener for the new tab.
          rel="nofollow noopener noreferrer"
          title="Best digital marketing company in kolkata"
          href={`https://favfly.com?ref=${process.env.PRISMIC_ID}.${process.env.TLD}`}
          className="container pt-3 d-block"
        >
          Growing with Favfly
        </a>
      </div>
      <style jsx>{`
        .favfly i,
        .favfly a {
          color: ${colors.secondary} !important;
          font-weight: 500;
          transition: all 0.3s ease-in-out;
          opacity: 1;
        }

        .favfly:hover a,
        .favfly:hover i {
          color: ${colors.primary} !important;
        }
        .favfly:hover .divider-icon:before,
        .favfly:hover .divider-icon:after {
          border-color: ${colors.primary};
        }

        .divider-icon:before,
        .divider-icon:after {
          position: absolute;
          top: 50%;
          content: "";
          border-top: 1px solid ${colors.secondary};
          width: calc(50% - 30px);
          transition: all 0.3s ease-in-out;
        }

        .favfly {
          letter-spacing: 1px;
          text-align: center;
          opacity: 0.7;
          transition: all 0.3s ease-in-out;
        }

        .favfly:hover {
          opacity: 1;
        }

        .divider-icon:before {
          left: 0;
        }

        .divider-icon i {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 18px;
          transition: all 0.3s ease-in-out;
        }
        .divider-icon:after {
          right: 0;
        }
      `}</style>
    </>
  );
};

export default BrandMark;
