import React from "react";
import useTitle from "../hooks/useTitle";
import Me from "../assets/home/Me.png";

const About = () => {
  useTitle("About");
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-200 mb-12 text-center">
          About Me
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative flex justify-center bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 p-3 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105">
              <img
                src={Me}
                alt="Marcus David Alo"
                className="w-full h-full rounded-lg shadow-md object-cover transform hover:scale-105 transition duration-500"
              />
              <p className="absolute bottom-2 mx-2 bg-gray-800/90 text-white text-sm px-3 py-1 rounded-lg">
                This image was generated with my actual face run through Stable
                Diffusion Controlnet.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-6">
              Marcus David Alo
            </h2>
            <div className="text-lg space-y-6 leading-relaxed text-gray-700 dark:text-gray-400">
              <p>
                I am an enthusiastic beginner web developer with a solid grasp
                of JavaScript, React, and modern web technologies. I'm
                passionate about continuously expanding my skills in web
                development. Currently, I'm self-studying AI and Python, and
                I've even cloned some language models like Ollama and TavernAI.
                I've also enjoyed cloning and using web interfaces for projects
                like "InvokeAI" and "Automatic1111", and I'm now exploring
                "OpenDevin" and "Devika" which is to my knowledge an open source
                version of Devin.ai.
              </p>
              <p>
                I'm always eager to learn new emerging technologies relating to
                web development and AI. Discovering fresh technology excites me
                for the future. I experimented with Expo after encountering
                React Native as it was the easiest way to get started on it.
                These endeavors continuously grow my abilities and understanding
                in different tech areas.
              </p>
              <p>
                On Kodego, I took their web development bootcamp course as I
                have always been interested in web development, but before that,
                I studied Computer Science at AMA Computer College Cebu. While
                at AMA, I left during my third year. The reason was that I felt
                like I wasn't truly learning about Computer Science and was
                simply learning what seemed more fit for IT students. Despite
                that, it was still a meaningful experience. It inspired me to
                try pursuing a more practical, self-directed educational path.
              </p>
              <p>
                When I'm not coding or studying new tech, I dig into other
                interests. Reading up on the latest technology trends keeps me
                informed. Exploring nature rejuvenates me. And engaging with
                artificial intelligence brings me joy. These varied pursuits
                balance my driven approach to coding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
