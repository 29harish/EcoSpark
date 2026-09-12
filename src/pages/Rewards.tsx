import { useEffect, useMemo, useState } from 'react';

import {
  CheckCircle2,
  Coins,
  Gift,
  Lock,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';

import { Card, GradientCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';

import { useApp } from '@/context/AppContext';

import {
  loadRewardRedemptions,
  type RewardRedemption,
} from '@/lib/profileStore';

import { rewards } from '@/data/mockData';

type RewardCategory =
  | 'all'
  | 'real'
  | 'badge'
  | 'digital';

function getCategoryLabel(
  category: string,
): string {
  switch (category) {
    case 'real':
      return 'Real Item';

    case 'badge':
      return 'Badge';

    case 'digital':
      return 'Digital';

    default:
      return 'Reward';
  }
}

export function Rewards() {
  const {
    coins,
    redeemReward,
  } = useApp();

  const [
    redemptions,
    setRedemptions,
  ] = useState<RewardRedemption[]>([]);

  const [
    loadingRedemptions,
    setLoadingRedemptions,
  ] = useState(true);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<RewardCategory>('all');

  const [search, setSearch] =
    useState('');

  const [
    selectedReward,
    setSelectedReward,
  ] = useState<
    (typeof rewards)[number] | null
  >(null);

  const [
    redeemingId,
    setRedeemingId,
  ] = useState<string | null>(null);

  const [toast, setToast] =
    useState<string | null>(null);

  /*
   * Load redemption history from the backend.
   *
   * This means ownership is tied to the
   * authenticated user in Supabase rather
   * than the current browser.
   */
  useEffect(() => {
    let mounted = true;

    const loadRedemptions = async () => {
      setLoadingRedemptions(true);

      try {
        const data =
          await loadRewardRedemptions();

        if (mounted) {
          setRedemptions(data);
        }
      } catch (error) {
        console.error(
          'Unable to load reward history:',
          error,
        );

        if (mounted) {
          setRedemptions([]);
        }
      } finally {
        if (mounted) {
          setLoadingRedemptions(false);
        }
      }
    };

    void loadRedemptions();

    return () => {
      mounted = false;
    };
  }, []);

  const showToast = (
    message: string,
  ) => {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const purchased = useMemo(
    () =>
      new Set(
        redemptions
          .filter(
            (item) =>
              item.status ===
              'completed',
          )
          .map(
            (item) =>
              item.rewardId,
          ),
      ),
    [redemptions],
  );

  const filteredRewards = useMemo(() => {
    const normalizedSearch =
      search
        .trim()
        .toLowerCase();

    return rewards.filter(
      (reward) => {
        const matchesCategory =
          selectedCategory ===
            'all' ||
          reward.category ===
            selectedCategory;

        const matchesSearch =
          !normalizedSearch ||
          reward.title
            .toLowerCase()
            .includes(
              normalizedSearch,
            ) ||
          reward.description
            .toLowerCase()
            .includes(
              normalizedSearch,
            );

        return (
          matchesCategory &&
          matchesSearch
        );
      },
    );
  }, [
    selectedCategory,
    search,
  ]);

  const handlePurchase =
    async (
      reward: (typeof rewards)[number],
    ) => {
      if (
        purchased.has(
          reward.id,
        )
      ) {
        return;
      }

      if (redeemingId) {
        return;
      }

      /*
       * This is only a UX check.
       *
       * The backend remains the real authority
       * for the balance and reward cost.
       */
      if (coins < reward.cost) {
        showToast(
          `You need ${
            reward.cost - coins
          } more Eco Coins.`,
        );

        return;
      }

      setRedeemingId(
        reward.id,
      );

      try {
        const success =
          await redeemReward(
            reward.id,
          );

        if (!success) {
          showToast(
            'Unable to redeem this reward. Please try again.',
          );

          return;
        }

        /*
         * Reload the authoritative redemption history instead of
         * creating a fake local redemption record.
         *
         * The backend has already deducted the coins and inserted
         * the redemption in Supabase.
         */
        try {
          const latestRedemptions =
            await loadRewardRedemptions();
          setRedemptions(latestRedemptions);
        } catch (historyError) {
          console.warn(
            'Redemption succeeded but history refresh failed:',
            historyError,
          );
        }

        setSelectedReward(null);

        showToast(
          `🎉 ${reward.title} redeemed successfully!`,
        );
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : 'Unable to redeem this reward.',
        );
      } finally {
        setRedeemingId(
          null,
        );
      }
    };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Rewards"
        icon={
          <Gift className="w-5 h-5" />
        }
        subtitle="Use your Eco Coins to unlock rewards and celebrate your environmental progress."
      />

      {/* Balance */}
      <GradientCard
        gradient="from-sun-400 to-coral-400"
        className="p-6 mb-8 animate-slide-up"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Coins className="w-7 h-7 text-white" />
            </div>

            <div>
              <p className="text-sm text-white/80 font-semibold">
                Your Eco Coins
              </p>

              <div className="text-3xl font-extrabold text-white">
                {coins.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />

            Complete lessons and missions to earn more.
          </div>
        </div>
      </GradientCard>

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-leaf-600 text-white rounded-2xl px-6 py-3 shadow-lg animate-pop-in font-bold max-w-[90vw] text-center">
          {toast}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 md:p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                [
                  'all',
                  'All Rewards',
                ],
                [
                  'digital',
                  'Digital',
                ],
                [
                  'badge',
                  'Badges',
                ],
                [
                  'real',
                  'Real Items',
                ],
              ] as const
            ).map(
              ([
                value,
                label,
              ]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      value,
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                    selectedCategory ===
                    value
                      ? 'bg-leaf-600 text-white'
                      : 'bg-leaf-50 text-leaf-700 hover:bg-leaf-100'
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-leaf-500" />

            <input
              type="text"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search rewards..."
              className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-10 pr-4 text-sm text-leaf-800 outline-none focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100"
            />
          </div>
        </div>
      </Card>

      {/* Rewards */}
      {filteredRewards.length ===
      0 ? (
        <Card className="p-10 text-center">
          <Gift className="w-12 h-12 text-leaf-200 mx-auto mb-3" />

          <h3 className="font-extrabold text-leaf-800">
            No rewards found
          </h3>

          <p className="text-sm text-leaf-600/60 mt-1">
            Try another category or search term.
          </p>

          {(search ||
            selectedCategory !==
              'all') && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setSelectedCategory(
                  'all',
                );
              }}
            >
              Clear filters
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-leaf-800">
                Available rewards
              </h2>

              <p className="text-sm text-leaf-600/60 mt-1">
                {
                  filteredRewards.length
                }{' '}
                reward
                {filteredRewards.length !==
                1
                  ? 's'
                  : ''}{' '}
                available
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRewards.map(
              (reward) => {
                const isPurchased =
                  purchased.has(
                    reward.id,
                  );

                const canAfford =
                  coins >=
                  reward.cost;

                const isRedeeming =
                  redeemingId ===
                  reward.id;

                return (
                  <Card
                    key={
                      reward.id
                    }
                    className={`overflow-hidden group transition-all duration-300 ${
                      isPurchased
                        ? 'ring-1 ring-leaf-200'
                        : 'hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    {/* Image */}
                    <div
                      className={`h-36 bg-gradient-to-br ${reward.color} relative flex items-center justify-center`}
                    >
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {
                          reward.emoji
                        }
                      </div>

                      {isPurchased && (
                        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-leaf-500" />
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3">
                        <Badge
                          variant="gray"
                          size="sm"
                          className="!bg-white/85 !backdrop-blur !text-leaf-700"
                        >
                          {getCategoryLabel(
                            reward.category,
                          )}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-extrabold text-leaf-800 mb-1">
                        {
                          reward.title
                        }
                      </h3>

                      <p className="text-sm text-leaf-600/70 leading-relaxed min-h-[60px]">
                        {
                          reward.description
                        }
                      </p>

                      <div className="flex items-center justify-between gap-3 mt-4">
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-sun-500" />

                          <span className="font-extrabold text-sun-600">
                            {reward.cost.toLocaleString()}
                          </span>
                        </div>

                        {isPurchased ? (
                          <Badge
                            variant="green"
                            size="md"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Owned
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant={
                              canAfford
                                ? 'primary'
                                : 'outline'
                            }
                            disabled={
                              !canAfford ||
                              Boolean(
                                redeemingId,
                              ) ||
                              loadingRedemptions
                            }
                            onClick={() =>
                              setSelectedReward(
                                reward,
                              )
                            }
                          >
                            {isRedeeming ? (
                              'Redeeming...'
                            ) : canAfford ? (
                              <>
                                <ShoppingBag className="w-4 h-4 mr-1.5" />
                                Redeem
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4 mr-1.5" />
                                Locked
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {!isPurchased &&
                        !canAfford && (
                          <p className="text-xs text-leaf-600/50 text-right mt-2">
                            Need{' '}
                            {(
                              reward.cost -
                              coins
                            ).toLocaleString()}{' '}
                            more coins
                          </p>
                        )}
                    </div>
                  </Card>
                );
              },
            )}
          </div>
        </>
      )}

      {/* Confirmation modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div
              className={`h-32 bg-gradient-to-br ${selectedReward.color} flex items-center justify-center relative`}
            >
              <div className="text-5xl">
                {
                  selectedReward.emoji
                }
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReward(
                    null,
                  )
                }
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-leaf-700 hover:bg-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-leaf-500">
                Confirm redemption
              </p>

              <h2 className="text-xl font-extrabold text-leaf-800 mt-1">
                {
                  selectedReward.title
                }
              </h2>

              <p className="text-sm text-leaf-600/70 mt-2 leading-relaxed">
                {
                  selectedReward.description
                }
              </p>

              <div className="mt-5 rounded-2xl bg-leaf-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-leaf-700">
                    Reward cost
                  </span>

                  <span className="flex items-center gap-1.5 font-extrabold text-sun-600">
                    <Coins className="w-4 h-4" />

                    {selectedReward.cost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-leaf-700">
                    Your balance
                  </span>

                  <span className="font-extrabold text-leaf-700">
                    {coins.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-leaf-200 mt-3 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-leaf-800">
                    Remaining balance
                  </span>

                  <span className="font-extrabold text-leaf-800">
                    {Math.max(
                      coins -
                        selectedReward.cost,
                      0,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={Boolean(
                    redeemingId,
                  )}
                  onClick={() =>
                    setSelectedReward(
                      null,
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1"
                  disabled={
                    Boolean(
                      redeemingId,
                    ) ||
                    coins <
                      selectedReward.cost ||
                    purchased.has(
                      selectedReward.id,
                    )
                  }
                  onClick={() =>
                    void handlePurchase(
                      selectedReward,
                    )
                  }
                >
                  {redeemingId ===
                  selectedReward.id
                    ? 'Redeeming...'
                    : 'Confirm Redeem'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}