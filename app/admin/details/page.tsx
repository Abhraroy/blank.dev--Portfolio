"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAdminStore } from "../_components/store";
import { ArrayInput } from "../_components/ArrayInput";
import { FileUploader } from "../_components/FileUploader";
import {
  FiUser,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiMessageSquare,
  FiGlobe,
  FiMapPin,
  FiClock,
  FiSave,
  FiCheck,
  FiLayers,
  FiFileText,
  FiHome,
  FiNavigation,
  FiMap,
  FiHash,
} from "react-icons/fi";

export default function DetailsPage() {
  const { details, modes, activeModeId, updateMyDetails, updateMyDetailsModeContent } =
    useAdminStore();

  const [savedFactToast, setSavedFactToast] = useState(false);
  const [savedStoryToast, setSavedStoryToast] = useState(false);

  // Core Fact Form State
  const [fullName, setFullName] = useState(details.full_name || "");
  const [profileImage, setProfileImage] = useState(details.profile_image || "");
  const [resumeUrl, setResumeUrl] = useState(details.resume_url || "");
  const [email, setEmail] = useState(details.email || "");
  const [githubUrl, setGithubUrl] = useState(details.github_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(details.linkedin_url || "");
  const [xUrl, setXUrl] = useState(details.x_url || "");
  const [instagramUrl, setInstagramUrl] = useState(details.instagram_url || "");
  const [discordUrl, setDiscordUrl] = useState(details.discord_url || "");
  const [websiteUrl, setWebsiteUrl] = useState(details.website_url || "");
  const [location, setLocation] = useState(details.location || "");
  const [address, setAddress] = useState(details.address || "");
  const [district, setDistrict] = useState(details.district || "");
  const [state, setState] = useState(details.state || "");
  const [country, setCountry] = useState(details.country || "");
  const [pinCode, setPinCode] = useState(details.pin_code || "");
  const [yearsExp, setYearsExp] = useState<number | undefined>(
    details.years_of_experience || undefined
  );

  // Sync profile facts state when store details load/update
  React.useEffect(() => {
    if (details) {
      setFullName(details.full_name || "");
      setProfileImage(details.profile_image || "");
      setResumeUrl(details.resume_url || "");
      setEmail(details.email || "");
      setGithubUrl(details.github_url || "");
      setLinkedinUrl(details.linkedin_url || "");
      setXUrl(details.x_url || "");
      setInstagramUrl(details.instagram_url || "");
      setDiscordUrl(details.discord_url || "");
      setWebsiteUrl(details.website_url || "");
      setLocation(details.location || "");
      setAddress(details.address || "");
      setDistrict(details.district || "");
      setState(details.state || "");
      setCountry(details.country || "");
      setPinCode(details.pin_code || "");
      setYearsExp(details.years_of_experience || undefined);
    }
  }, [details]);

  // Active Story Mode Content lookup & state
  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];
  const activeContent = details.modeContents?.find(
    (c) => c.portfolioModeId === activeModeId
  );

  const [headline, setHeadline] = useState(activeContent?.headline || "");
  const [shortBio, setShortBio] = useState(activeContent?.short_bio || "");
  const [detailedBio, setDetailedBio] = useState(activeContent?.detailed_bio || "");
  const [highlights, setHighlights] = useState<string[]>(
    activeContent?.highlights || []
  );

  // Sync mode content when activeModeId changes
  React.useEffect(() => {
    const freshContent = details.modeContents?.find(
      (c) => c.portfolioModeId === activeModeId
    );
    setHeadline(freshContent?.headline || "");
    setShortBio(freshContent?.short_bio || "");
    setDetailedBio(freshContent?.detailed_bio || "");
    setHighlights(freshContent?.highlights || []);
  }, [activeModeId, details.modeContents]);

  const handleSaveFacts = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyDetails({
      full_name: fullName,
      profile_image: profileImage || null,
      resume_url: resumeUrl || null,
      email,
      github_url: githubUrl || null,
      linkedin_url: linkedinUrl || null,
      x_url: xUrl || null,
      instagram_url: instagramUrl || null,
      discord_url: discordUrl || null,
      website_url: websiteUrl || null,
      location: location || null,
      address: address || null,
      district: district || null,
      state: state || null,
      country: country || null,
      pin_code: pinCode || null,
      years_of_experience: yearsExp ? Number(yearsExp) : null,
    });
    setSavedFactToast(true);
    toast.success("Profile facts saved successfully!");
    setTimeout(() => setSavedFactToast(false), 2500);
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyDetailsModeContent(activeModeId, {
      headline: headline || null,
      short_bio: shortBio || null,
      detailed_bio: detailedBio || null,
      highlights,
    });
    setSavedStoryToast(true);
    toast.success(`Saved ${activeMode?.mode_name || "persona"} story!`);
    setTimeout(() => setSavedStoryToast(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 font-mono">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-xs tracking-[0.28em] text-zinc-400 uppercase font-semibold">
            Domain Facts & Personas
          </p>
          <h1 className="text-2xl font-bold text-zinc-50 flex items-center gap-2 mt-1">
            <FiUser className="text-zinc-300 h-6 w-6" /> My Details & Persona Storytelling
          </h1>
          <p className="text-sm text-zinc-300 mt-1 font-sans leading-relaxed">
            Primary developer contact facts (`MyDetails`) and per-mode persona bio storytelling (`MyDetailsModeContent`).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel 1: Primary Profile Facts */}
        <form
          onSubmit={handleSaveFacts}
          className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-5 shadow-[0_0_12px_rgba(255,255,255,0.06)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiUser className="text-zinc-400 h-4.5 w-4.5" /> Core Profile Facts (`MyDetails`)
            </h2>
            {savedFactToast && (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-400 font-semibold">
                <FiCheck /> Saved
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase text-zinc-400 font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase text-zinc-400 font-semibold">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <FileUploader
                label="Profile Avatar Image (Upload to R2)"
                defaultFolder="avatar"
                acceptedTypes="image"
                currentUrl={profileImage}
                onUploadSuccess={(url) => setProfileImage(url)}
              />
              <input
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="Or paste Profile Image URL directly"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
              />
            </div>

            {/* Resume / CV Upload Section */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <FileUploader
                label="Resume / CV Document (.pdf, .docx, .md Upload to R2)"
                defaultFolder="resumes"
                acceptedTypes="all"
                currentUrl={resumeUrl}
                onUploadSuccess={(url) => setResumeUrl(url)}
              />
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="Or paste Resume / CV URL (.pdf, .docx, .md) directly"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
              />
            </div>

            {/* Profile Location & Address Details Section */}
            <div className="space-y-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="block text-xs uppercase tracking-[0.2em] text-zinc-300 font-semibold flex items-center gap-2">
                  <FiMapPin className="text-zinc-400 h-4 w-4" /> Location & Address Details
                </span>
                <span className="text-[10px] text-zinc-500 font-sans">
                  Used across portfolio badges & about section
                </span>
              </div>

              {/* Address / Street */}
              <div className="space-y-1">
                <label className="block text-xs uppercase text-zinc-400 font-semibold">
                  Street / Detailed Address
                </label>
                <div className="relative">
                  <FiHome className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Tech Street, Suite 400"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* District & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase text-zinc-400 font-semibold">
                    District / City
                  </label>
                  <div className="relative">
                    <FiNavigation className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Kolkata / San Francisco"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase text-zinc-400 font-semibold">
                    State / Region
                  </label>
                  <div className="relative">
                    <FiMap className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. West Bengal / CA"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Country, Pin Code & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase text-zinc-400 font-semibold">
                    Country
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India / USA"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase text-zinc-400 font-semibold">
                    PIN Code / Postal Code
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="e.g. 700001 / 94103"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase text-zinc-400 font-semibold">
                    Years of Exp.
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                    <input
                      type="number"
                      value={yearsExp ?? ""}
                      onChange={(e) =>
                        setYearsExp(e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="5"
                      className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Formatted / Summary Location String */}
              <div className="space-y-1 pt-1">
                <label className="block text-xs uppercase text-zinc-400 font-semibold flex items-center justify-between">
                  <span>Formatted Summary Location (Badge & Short Display)</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Optional manual override</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-3 text-zinc-500 h-4 w-4" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Auto-generated from District, State, Country, PIN Code"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/80 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                Social Profiles & Links (Connect Section DB Controls)
              </span>

              <div className="space-y-2">
                <div className="relative">
                  <FiGithub className="absolute left-3.5 top-2.5 text-zinc-500 h-4 w-4" />
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <FiLinkedin className="absolute left-3.5 top-2.5 text-zinc-500 h-4 w-4" />
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="LinkedIn URL"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <FiTwitter className="absolute left-3.5 top-2.5 text-zinc-500 h-4 w-4" />
                  <input
                    type="url"
                    value={xUrl}
                    onChange={(e) => setXUrl(e.target.value)}
                    placeholder="X (Twitter) URL"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <FiInstagram className="absolute left-3.5 top-2.5 text-zinc-500 h-4 w-4" />
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="Instagram URL"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <FiMessageSquare className="absolute left-3.5 top-2.5 text-zinc-500 h-4 w-4" />
                  <input
                    type="url"
                    value={discordUrl}
                    onChange={(e) => setDiscordUrl(e.target.value)}
                    placeholder="Discord Server / Profile URL"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <FiGlobe className="absolute left-3.5 top-2.5 text-zinc-500 h-4 w-4" />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="Personal Website URL"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-semibold shadow-sm transition-all"
            >
              <FiSave className="h-4 w-4" /> Save Profile Facts
            </button>
          </div>
        </form>

        {/* Panel 2: Persona Mode Storytelling */}
        <form
          onSubmit={handleSaveStory}
          className="rounded-2xl border border-white/10 bg-zinc-950/40 backdrop-blur-xl p-6 space-y-5 shadow-[0_0_12px_rgba(255,255,255,0.06)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-[0.2em] flex items-center gap-2">
                <FiLayers className="text-zinc-400" /> Storytelling (`MyDetailsModeContent`)
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Active Mode: <span className="font-semibold text-white">{activeMode?.mode_name}</span>
              </p>
            </div>
            {savedStoryToast && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                <FiCheck /> Saved
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-zinc-400">
                Persona Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer crafting resilient web platforms"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-zinc-400">
                Short Bio (Hero Summary)
              </label>
              <textarea
                rows={2}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                placeholder="1-2 punchy sentences about your role in this persona..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-zinc-400">
                Detailed Bio (About Page)
              </label>
              <textarea
                rows={4}
                value={detailedBio}
                onChange={(e) => setDetailedBio(e.target.value)}
                placeholder="Full narrative for this persona profile..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-white/30 focus:outline-none font-sans"
              />
            </div>

            <ArrayInput
              label="Persona Highlights (Bullet Points)"
              placeholder="e.g. Architected systems serving 100k+ MAU"
              items={highlights}
              onChange={setHighlights}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-zinc-50 text-xs font-semibold shadow-sm transition-all"
            >
              <FiSave className="h-4 w-4" /> Save {activeMode?.mode_name} Bio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
