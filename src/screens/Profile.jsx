import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import {
  IconBasket,
  IconEye,
  IconGrid,
  IconHeart,
  IconMenu,
  IconUserPlus,
  IconUsers,
  IconVerified,
  IconVideoTab,
} from '../components/Icons'
import { profileGridByTab, profileTabs, profileUser } from '../data/profile'
import { formatCompactCount, toPersianDigits } from '../utils/format'

function ProfileStat({ icon, value }) {
  return (
    <span className="flex items-center gap-1 text-sm text-text-secondary">
      {icon}
      <span className="font-semibold text-text">{value}</span>
    </span>
  )
}

function ProfileTile({ item }) {
  return (
    <button
      type="button"
      className="relative aspect-[3/4] w-full overflow-hidden bg-surface-secondary"
    >
      <img
        src={item.image}
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-2 pb-2 pt-6">
        <span className="flex items-center gap-1 text-[0.6875rem] font-medium text-text-inverse drop-shadow">
          <IconEye className="size-3.5 shrink-0" />
          {formatCompactCount(item.views)}
        </span>
      </div>
    </button>
  )
}

function tabIcon(tabId, active) {
  const className = `size-5 ${active ? 'text-text' : 'text-text-muted'}`
  if (tabId === 'products') return <IconGrid className={className} />
  if (tabId === 'videos') return <IconVideoTab className={className} />
  return <IconHeart className={className} />
}

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('videos')

  const gridItems = useMemo(
    () => profileGridByTab[activeTab] ?? [],
    [activeTab],
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface pt-[calc(2rem+env(safe-area-inset-top))]">
      <header className="flex shrink-0 items-center gap-2 px-4 pb-2 pt-1">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full text-text transition active:bg-surface-secondary"
          aria-label="منو"
        >
          <IconMenu className="size-6" />
        </button>
        <p className="min-w-0 truncate text-sm font-semibold text-text">
          @{profileUser.handle}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar pb-28">
        <div className="flex items-center gap-3 px-4 pt-1">
          <Avatar src={profileUser.avatar} alt={profileUser.name} size="xl" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-base font-bold text-text">{profileUser.name}</h1>
              {profileUser.verified ? <IconVerified className="size-4 shrink-0" /> : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <ProfileStat
                icon={<IconUsers className="size-4 text-text" />}
                value={formatCompactCount(profileUser.stats.followers)}
              />
              <ProfileStat
                icon={<IconUserPlus className="size-4 text-text" />}
                value={toPersianDigits(profileUser.stats.following)}
              />
              <ProfileStat
                icon={<IconBasket className="size-4 text-text" />}
                value={toPersianDigits(profileUser.stats.products)}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1 px-4 text-sm leading-6 text-text-secondary">
          {profileUser.bio.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="mt-4 flex gap-2 px-4">
          <button
            type="button"
            onClick={() => navigate('/sell', { state: { from: '/profile' } })}
            className="min-h-10 flex-1 rounded-sm bg-primary px-3 text-sm font-semibold text-primary-foreground transition active:bg-primary-hover"
          >
            ثبت آگهی
          </button>
          <button
            type="button"
            className="min-h-10 flex-1 rounded-sm bg-input px-3 text-sm font-semibold text-text transition active:opacity-80"
          >
            اشتراک‌گذاری پروفایل
          </button>
        </div>

        <div className="mt-5 flex border-b border-border">
          {profileTabs.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 flex-col items-center gap-1.5 pb-2.5 pt-1 transition ${
                  active
                    ? '-mb-px border-b-2 border-cta text-text'
                    : 'text-text-muted'
                }`}
              >
                {tabIcon(tab.id, active)}
                <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-0">
          {gridItems.map((item) => (
            <ProfileTile key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
