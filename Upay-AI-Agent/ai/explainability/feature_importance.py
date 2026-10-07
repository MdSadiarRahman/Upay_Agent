def rank_features(contributions):
    sorted_contributions = sorted(contributions, key=lambda x: abs(x["contribution"]), reverse=True)
    
    positive_factors = []
    negative_factors = []
    
    for item in sorted_contributions:
        if item["contribution"] > 0:
            positive_factors.append(item)
        elif item["contribution"] < 0:
            negative_factors.append(item)
            
    return positive_factors, negative_factors
