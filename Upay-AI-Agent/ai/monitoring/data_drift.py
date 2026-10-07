import numpy as np
from datetime import datetime

class DataDriftDetector:
    def __init__(self, baseline_stats):
        """
        baseline_stats: dict
        Example: {'avg_transaction': 3000, 'freq_monthly': 40}
        """
        self.baseline_stats = baseline_stats
    
    def check_drift(self, current_stats, threshold=0.2):
        """Checks if current stats deviate from baseline by more than threshold."""
        drift_report = {
            'timestamp': datetime.now().isoformat(),
            'drifts_detected': [],
            'overall_status': 'Stable'
        }
        
        for feature, baseline_val in self.baseline_stats.items():
            if feature in current_stats:
                current_val = current_stats[feature]
                if baseline_val > 0:
                    change = abs(current_val - baseline_val) / baseline_val
                    if change > threshold:
                        drift_report['drifts_detected'].append({
                            'feature': feature,
                            'baseline': baseline_val,
                            'current': current_val,
                            'change_pct': round(change * 100, 2),
                            'warning': f'Data Drift Detected \u26a0 Change: {round(change * 100, 2)}%'
                        })
        
        if len(drift_report['drifts_detected']) > 0:
            drift_report['overall_status'] = 'Drift Detected'
            drift_report['recommendation'] = 'Review model performance.'
            
        return drift_report
