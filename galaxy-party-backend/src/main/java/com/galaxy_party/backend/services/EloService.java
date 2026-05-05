package com.galaxy_party.backend.services;

import org.springframework.stereotype.Service;

@Service
public class EloService {

    private static final int K = 32;

    public int[] calculateNewElos(int winnerElo, int loserElo) {
        double expectedWinner = 1.0 / (1 + Math.pow(10, (double) (loserElo - winnerElo) / 400));
        double expectedLoser  = 1.0 - expectedWinner;

        int newWinnerElo = (int) Math.round(winnerElo + K * (1 - expectedWinner));
        int newLoserElo  = (int) Math.max(0, Math.round(loserElo + K * (0 - expectedLoser)));

        return new int[]{ newWinnerElo, newLoserElo };
    }
}
