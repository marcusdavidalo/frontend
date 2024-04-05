import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-max">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">About Me</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src="https://via.placeholder.com/300x300"
              alt="Marcus David Alo"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Marcus David Alo
            </h2>
            <p className="text-gray-600 mb-4">
              I am a passionate web developer with expertise in React, Tailwind
              CSS, and modern web technologies. I have a strong background in
              building responsive and user-friendly web applications.
            </p>
            <p className="text-gray-600 mb-4">
              In addition to my technical skills, I have a keen eye for design
              and a deep understanding of user experience principles. I'm always
              eager to take on new challenges and contribute to exciting
              projects.
            </p>
            <p className="text-gray-600 mb-4">
              When I'm not coding, you can find me exploring the great outdoors,
              reading about the latest technology trends, or trying out new
              recipes in the kitchen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
