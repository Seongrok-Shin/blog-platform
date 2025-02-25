import Image from "next/image";
import Link from "next/link";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          About My Blog Platform
        </h1>
        <p className="mt-2 text-xl text-gray-600">
          Empowering voices, connecting ideas
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          My Mission
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          I dedicated to providing a powerful, user-friendly platform where
          bloggers of all levels can create, share, and grow their online
          presence. Our goal is to foster a vibrant community of writers and
          readers, connecting diverse perspectives from around the world.
        </p>
      </section>

      <section className="mb-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
          <Image
            src="https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg"
            alt="Our Team Collaborating"
            width={500}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            Who I Am
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            I am a passionate developer, designer, and content creator who
            believe in the power of words. With our combined expertise in
            technology and digital publishing, I have built a platform that puts
            creativity and ease-of-use at the forefront.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          What Sets Me Apart
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Tags and categories for easy navigation",
            "Responsive design for optimal viewing on all devices",
            "Search functionality for finding content",
            "Authentication and authorization for secure access",
          ].map((feature, index) => (
            <li key={index} className="flex items-center text-lg text-gray-700">
              <svg
                className="w-6 h-6 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Ready to Start Your Blogging Journey?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Join my community today and turn your ideas into impactful content.
        </p>
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started for Free
        </Link>
      </section>
    </div>
  );
};

export default AboutPage;
