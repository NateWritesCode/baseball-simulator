import { Link } from "@tanstack/react-router";

const Error404 = () => {
   return (
      <div>
         <p>Not found!</p>
         <Link to="/" style={{ textDecoration: "underline" }}>
            Go home
         </Link>
      </div>
   );
};

export default Error404;
