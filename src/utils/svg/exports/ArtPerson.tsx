// import { VPickListColorTokens } from "@/utils/types";
// import type { SVGProps } from "react";
// import { type Input, object, picklist } from "valibot";

// const VInput = object({
//    colorShirt: VPickListColorTokens,
//    eyes: picklist(["1", "2"]),
// });

// interface TInput extends SVGProps<SVGSVGElement>, Input<typeof VInput> {}

const ArtPerson = () => {
   // const animatedMouth = spring.map((animatedStyle, index) => {
   //    return (
   //       <animated.g
   //          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
   //          key={index}
   //          style={{
   //             o
   //             ...animatedStyle,
   //             // animatedStyle,
   //          }}
   //       >
   //          {/* <g
   //          style={{
   //             fill: "#000",
   //             fillOpacity: 1,
   //             stroke: "none",
   //          }}
   //       > */}
   //          <path
   //             d="M175 329.167c-8.333 4.166 8.333 12.5 25 12.5s33.333-8.334 25-12.5c-8.334-4.167-41.667-4.167-50 0Z"
   //             style={{
   //                opacity: 1,
   //                fill: "#000",
   //                fillOpacity: 1,
   //                stroke: "none",
   //                strokeWidth: 1.85575,
   //                strokeOpacity: 1,
   //             }}
   //          />
   //          {/* </g> */}
   //       </animated.g>
   //    );
   // });

   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         xmlnsXlink="http://www.w3.org/1999/xlink"
         viewBox="0 0 400 600"
         width={"100%"}
         height={"100%"}
      >
         <defs>
            <linearGradient id="d">
               <stop
                  offset={0}
                  style={{
                     stopColor: "#913900",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={1}
                  style={{
                     stopColor: "#7c3200",
                     stopOpacity: 1,
                  }}
               />
            </linearGradient>
            <linearGradient id="c">
               <stop
                  offset={0}
                  style={{
                     stopColor: "#007e00",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={1}
                  style={{
                     stopColor: "#004c00",
                     stopOpacity: 1,
                  }}
               />
            </linearGradient>
            <linearGradient id="b">
               <stop
                  offset={0.68}
                  style={{
                     stopColor: "#fff",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={1}
                  style={{
                     stopColor: "#e3e3e3",
                     stopOpacity: 1,
                  }}
               />
            </linearGradient>
            <linearGradient id="a">
               <stop
                  offset={0}
                  style={{
                     stopColor: "#ffb173",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={0.25}
                  style={{
                     stopColor: "#ffa870",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={0.5}
                  style={{
                     stopColor: "#ffa267",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={0.75}
                  style={{
                     stopColor: "#ffab76",
                     stopOpacity: 1,
                  }}
               />
               <stop
                  offset={1}
                  style={{
                     stopColor: "#ffac77",
                     stopOpacity: 1,
                  }}
               />
            </linearGradient>
            <linearGradient
               xlinkHref="#c"
               id="h"
               x1={150}
               x2={150}
               y1={235.037}
               y2={215.249}
               gradientTransform="translate(65.322 97.983) scale(.56452)"
               gradientUnits="userSpaceOnUse"
               spreadMethod="pad"
            />
            <linearGradient
               xlinkHref="#c"
               id="j"
               x1={150}
               x2={150}
               y1={235.037}
               y2={215.249}
               gradientTransform="translate(65.322 97.983) scale(.56452)"
               gradientUnits="userSpaceOnUse"
               spreadMethod="pad"
            />
            <radialGradient
               xlinkHref="#a"
               id="e"
               cx={200}
               cy={250}
               r={100}
               fx={200}
               fy={250}
               gradientTransform="matrix(1 0 0 1.5 0 -125)"
               gradientUnits="userSpaceOnUse"
            />
            <radialGradient
               xlinkHref="#b"
               id="g"
               cx={150}
               cy={225}
               r={25}
               fx={150}
               fy={225}
               gradientUnits="userSpaceOnUse"
            />
            <radialGradient
               xlinkHref="#d"
               id="l"
               cx={150.677}
               cy={186.277}
               r={24.323}
               fx={150.677}
               fy={186.277}
               gradientTransform="matrix(1 0 0 .1311 0 161.856)"
               gradientUnits="userSpaceOnUse"
            />
            <radialGradient
               xlinkHref="#d"
               id="m"
               cx={150.677}
               cy={186.277}
               r={24.323}
               fx={150.677}
               fy={186.277}
               gradientTransform="matrix(1 0 0 .1311 0 161.856)"
               gradientUnits="userSpaceOnUse"
            />
            <radialGradient
               xlinkHref="#b"
               id="i"
               cx={150}
               cy={225}
               r={25}
               fx={150}
               fy={225}
               gradientUnits="userSpaceOnUse"
            />
            <filter
               id="f"
               width={1.191}
               height={1.191}
               x={-0.096}
               y={-0.096}
               style={{}}
            >
               <feGaussianBlur stdDeviation={2.451} />
            </filter>
            <filter
               id="k"
               width={1.277}
               height={3.114}
               x={-0.139}
               y={-1.057}
               style={{}}
            >
               <feGaussianBlur stdDeviation={2.809} />
            </filter>
         </defs>
         <path
            d="M250 475s25 32.771 50 25c0 0 42.584-11.218 50 0 7.416 11.218 25 75 25 100H200V475Zm-100 0s-25 32.771-50 25c0 0-42.584-11.218-50 0-7.416 11.218-25 75-25 100h175V475Z"
            style={{
               fontVariationSettings: "normal",
               opacity: 1,
               vectorEffect: "none",
               fill: "#fca",
               fillOpacity: 1,
               stroke: "#000",
               strokeWidth: 1.00157,
               strokeLinecap: "butt",
               strokeLinejoin: "miter",
               strokeMiterlimit: 4,
               strokeDasharray: "none",
               strokeDashoffset: 0,
               strokeOpacity: 0.164565,

               stopColor: "#000",
               stopOpacity: 1,
            }}
         />
         <path
            d="M300 500s42.584-11.218 50 0c7.416 11.218 25 75 25 100H200v-68.74c87.578-6.26 60.83-19.084 100-31.26Zm-200 0s-42.584-11.218-50 0c-7.416 11.218-25 75-25 100h175v-68.74c-25 3.16-63.043-21.096-100-31.26Z"
            style={{
               fontVariationSettings: "normal",
               opacity: 1,
               vectorEffect: "none",
               fill: "#394e85",
               fillOpacity: 1,
               stroke: "none",
               strokeWidth: 1.00157,
               strokeLinecap: "butt",
               strokeLinejoin: "miter",
               strokeMiterlimit: 4,
               strokeDasharray: "none",
               strokeDashoffset: 0,
               strokeOpacity: 0.164565,

               stopColor: "#000",
               stopOpacity: 1,
            }}
         />
         <g
            style={{
               fill: "#fca",
               fillOpacity: 1,
               stroke: "none",
            }}
         >
            <path
               d="M172.783 376.091c-2.13.751 11.889 23.067-22.783 98.909h100c3.816 1.36-12.433-25-25-100z"
               style={{
                  fontVariationSettings: "normal",
                  opacity: 1,
                  vectorEffect: "none",
                  fill: "#fca",
                  fillOpacity: 1,
                  stroke: "#000",
                  strokeWidth: 1.00157,
                  strokeLinecap: "butt",
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  strokeDasharray: "none",
                  strokeDashoffset: 0,
                  strokeOpacity: 0.164565,

                  stopColor: "#000",
                  stopOpacity: 1,
               }}
            />
         </g>
         <g
            style={{
               display: "inline",
               fill: "url(#e)",
               fillOpacity: 1,
            }}
         >
            <path
               d="M200 100s-100 0-100 100v100s0 100 100 100 100-100 100-100V200s0-100-100-100z"
               style={{
                  mixBlendMode: "normal",
                  fill: "#fca",
                  fillOpacity: 1,
                  stroke: "#000",
                  strokeWidth: 1.00157,
                  strokeLinecap: "butt",
                  strokeLinejoin: "miter",
                  strokeDasharray: "none",
                  strokeOpacity: 0.164565,
               }}
            />
         </g>
         <path
            d="M150 150.562s50.542-24.847 100-.562"
            style={{
               fill: "none",
               stroke: "#000",
               strokeWidth: 1,
               strokeLinecap: "butt",
               strokeLinejoin: "miter",
               strokeOpacity: 1,
            }}
         />
         <path
            d="M150 158.562s50.542-24.847 100-.562M150 142.562s50.542-24.847 100-.562"
            style={{
               fill: "none",
               stroke: "#000",
               strokeWidth: 1,
               strokeLinecap: "butt",
               strokeLinejoin: "miter",
               strokeOpacity: 1,
            }}
         />
         <g
            style={{
               fill: "#000",
               stroke: "none",
            }}
         >
            <path
               d="M100 225s-7.735-10.908-14.934-7.926C80.264 219.063 74.39 233.64 75 238.288c4.025 30.618 26.07 17.572 25 11.712Z"
               style={{
                  fontVariationSettings: "normal",
                  opacity: 1,
                  vectorEffect: "none",
                  fill: "#fca",
                  fillOpacity: 1,
                  stroke: "#000",
                  strokeWidth: 1.00157,
                  strokeLinecap: "butt",
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  strokeDasharray: "none",
                  strokeDashoffset: 0,
                  strokeOpacity: 0.164565,

                  stopColor: "#000",
                  stopOpacity: 1,
               }}
            />
         </g>
         <g
            style={{
               fill: "#000",
               stroke: "none",
            }}
         >
            <path
               d="M300 225s7.735-10.908 14.934-7.926c4.802 1.989 10.677 16.567 10.066 21.214-4.025 30.618-26.07 17.572-25 11.712z"
               style={{
                  fontVariationSettings: "normal",
                  opacity: 1,
                  vectorEffect: "none",
                  fill: "#fca",
                  fillOpacity: 1,
                  stroke: "#000",
                  strokeWidth: 1.00157,
                  strokeLinecap: "butt",
                  strokeLinejoin: "miter",
                  strokeMiterlimit: 4,
                  strokeDasharray: "none",
                  strokeDashoffset: 0,
                  strokeOpacity: 0.164565,

                  stopColor: "#000",
                  stopOpacity: 1,
               }}
            />
         </g>
         <circle
            cx={150}
            cy={225}
            r={30.72}
            style={{
               display: "inline",
               opacity: 0.713446,
               mixBlendMode: "normal",
               fill: "#000",
               fillOpacity: 0.0922403,
               stroke: "none",
               strokeWidth: 2.28033,
               strokeOpacity: 1,
               filter: "url(#f)",
            }}
            transform="matrix(.9069 0 0 .9069 13.965 20.947)"
         />
         <circle
            cx={150}
            cy={225}
            r={25}
            style={{
               opacity: 1,
               fill: "url(#g)",
               stroke: "none",
               strokeWidth: 1.85575,
               strokeOpacity: 1,
            }}
         />
         <circle
            cx={150}
            cy={225}
            r={7.057}
            style={{
               opacity: 1,
               fill: "url(#h)",
               fillOpacity: 1,
               fillRule: "evenodd",
               stroke: "none",
               strokeWidth: 0.523805,
               strokeOpacity: 1,
            }}
         />
         <circle
            cx={150}
            cy={225}
            r={4.166}
            style={{
               opacity: 1,
               fill: "#000",
               fillOpacity: 1,
               fillRule: "evenodd",
               stroke: "none",
               strokeWidth: 0.309215,
               strokeOpacity: 1,
            }}
         />
         <g transform="translate(100)">
            <circle
               cx={150}
               cy={225}
               r={30.72}
               style={{
                  display: "inline",
                  opacity: 0.713446,
                  mixBlendMode: "normal",
                  fill: "#000",
                  fillOpacity: 0.0922403,
                  stroke: "none",
                  strokeWidth: 2.28033,
                  strokeOpacity: 1,
                  filter: "url(#f)",
               }}
               transform="matrix(.9069 0 0 .9069 13.965 20.947)"
            />
            <circle
               cx={150}
               cy={225}
               r={25}
               style={{
                  opacity: 1,
                  fill: "url(#i)",
                  stroke: "none",
                  strokeWidth: 1.85575,
                  strokeOpacity: 1,
               }}
            />
            <circle
               cx={150}
               cy={225}
               r={7.057}
               style={{
                  opacity: 1,
                  fill: "url(#j)",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  stroke: "none",
                  strokeWidth: 0.523805,
                  strokeOpacity: 1,
               }}
            />
            <circle
               cx={150}
               cy={225}
               r={4.166}
               style={{
                  opacity: 1,
                  fill: "#000",
                  fillOpacity: 1,
                  fillRule: "evenodd",
                  stroke: "none",
                  strokeWidth: 0.309215,
                  strokeOpacity: 1,
               }}
            />
         </g>
         <path
            d="M175 275.01S175 300 200 300M225 275.01S225 300 200 300"
            style={{
               fill: "none",
               stroke: "#000",
               strokeWidth: 1,
               strokeLinecap: "butt",
               strokeLinejoin: "miter",
               strokeOpacity: 1,
            }}
         />
         <path
            d="M175 187.39c-1.804-.587-7.043-2.798-10.823-3.52-3.955-.754-8.154-.79-12.43-.78-4.563.01-9.695.789-14.142.949-3.962.142-9.375.046-11.25.055 1.856.262 7.233.897 11.14 1.572 4.385.759 9.365 2.223 13.884 2.849 4.236.586 8.402 1.117 12.422.903 3.843-.205 9.332-1.69 11.199-2.028z"
            style={{
               opacity: 0.25437,
               fill: "#000",
               fillOpacity: 1,
               fillRule: "nonzero",
               stroke: "none",
               strokeWidth: 1.85575,
               strokeOpacity: 1,
               filter: "url(#k)",
            }}
            transform="rotate(-11.57 131.074 208.877) scale(1.02359)"
         />
         <path
            d="M175 187.39c-1.804-.587-7.043-2.798-10.823-3.52-3.955-.754-8.154-.79-12.43-.78-4.563.01-9.695.789-14.142.949-3.962.142-9.375.046-11.25.055 1.856.262 7.233.897 11.14 1.572 4.385.759 9.365 2.223 13.884 2.849 4.236.586 8.402 1.117 12.422.903 3.843-.205 9.332-1.69 11.199-2.028z"
            style={{
               opacity: 1,
               fill: "url(#l)",
               fillRule: "nonzero",
               stroke: "none",
               strokeWidth: 1.85575,
               strokeOpacity: 1,
            }}
            transform="rotate(-11.57 131.074 208.877) scale(1.02359)"
         />
         <path
            d="M175 187.39c-1.804-.587-7.043-2.798-10.823-3.52-3.955-.754-8.154-.79-12.43-.78-4.563.01-9.695.789-14.142.949-3.962.142-9.375.046-11.25.055 1.856.262 7.233.897 11.14 1.572 4.385.759 9.365 2.223 13.884 2.849 4.236.586 8.402 1.117 12.422.903 3.843-.205 9.332-1.69 11.199-2.028z"
            style={{
               opacity: 0.25437,
               fill: "#000",
               fillOpacity: 1,
               fillRule: "nonzero",
               stroke: "none",
               strokeWidth: 1.85575,
               strokeOpacity: 1,
               filter: "url(#k)",
            }}
            transform="matrix(-1.0028 -.2053 -.2053 1.0028 439.45 30.533)"
         />
         <path
            d="M175 187.39c-1.804-.587-7.043-2.798-10.823-3.52-3.955-.754-8.154-.79-12.43-.78-4.563.01-9.695.789-14.142.949-3.962.142-9.375.046-11.25.055 1.856.262 7.233.897 11.14 1.572 4.385.759 9.365 2.223 13.884 2.849 4.236.586 8.402 1.117 12.422.903 3.843-.205 9.332-1.69 11.199-2.028z"
            style={{
               opacity: 1,
               fill: "url(#m)",
               fillOpacity: 1,
               fillRule: "nonzero",
               stroke: "none",
               strokeWidth: 1.85575,
               strokeOpacity: 1,
            }}
            transform="matrix(-1.0028 -.2053 -.2053 1.0028 439.45 30.533)"
         />
         <path
            d="M100 225S39.825 61.599 200 75.314v36.35c-40.614-3.957-86.715 95.572-100 113.336ZM300 225S360.175 61.599 200 75.314v36.35c40.614-3.957 86.715 95.572 100 113.336Z"
            style={{
               fill: "#853500",
               fillOpacity: 1,
               stroke: "none",
               strokeWidth: 1,
               strokeLinecap: "butt",
               strokeLinejoin: "miter",
               strokeOpacity: 1,
            }}
         />
      </svg>
   );
};

export default ArtPerson;
